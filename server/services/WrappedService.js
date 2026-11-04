const logger = require('../log');
const db = require('../db');
const UserStatsService = require('./UserStatsService');
const { DominantWinSql } = require('./DominantWin');
const { summarise } = UserStatsService;

// Bump when the shape of a snapshot changes; the page can check it before showing older snapshots
const WrappedVersion = 2;

// Players need this many finished games in the year to get a Wrapped
const MinGames = 10;

// A Wrapped can be seen, and is emailed, for this long after it was generated
const AvailableForSql = "interval '2 months'";

const YearPattern = /^20\d{2}$/;

// How many players' snapshots are worked out at once
const Concurrency = 4;

const FinishedInRangeSql =
    'g."StartedAt" >= $1 AND g."StartedAt" < $2 AND g."FinishedAt" IS NOT NULL AND g."WinnerId" IS NOT NULL';

/**
 * @typedef PlayerTotals
 * @property {number} userId
 * @property {string} username
 * @property {number} games
 * @property {number} wins
 * @property {number} dominantWins
 */

/**
 * Where a value ranks among everyone's, as "top N%" (1 = the very top). Ties share the better rank.
 * @param {number[]} sortedDescending
 * @param {number} value
 */
function topPercent(sortedDescending, value) {
    const higher = sortedDescending.findIndex((other) => other <= value);
    const position = higher === -1 ? sortedDescending.length : higher;

    return Math.max(1, Math.ceil((100 * (position + 1)) / sortedDescending.length));
}

/**
 * Works out each eligible player's ranks among all eligible players
 * @param {PlayerTotals[]} players Every eligible player's totals for the year
 * @returns {Map<number, {games: number, wins: number, winRate: number, dominantWins: number}>}
 */
function rankPlayers(players) {
    const metrics = {
        games: (player) => player.games,
        wins: (player) => player.wins,
        winRate: (player) => player.wins / player.games,
        dominantWins: (player) => player.dominantWins
    };

    const sorted = {};
    for (const [name, metric] of Object.entries(metrics)) {
        sorted[name] = players.map(metric).sort((a, b) => b - a);
    }

    const ranks = new Map();
    for (const player of players) {
        const playerRanks = {};
        for (const [name, metric] of Object.entries(metrics)) {
            playerRanks[name] = topPercent(sorted[name], metric(player));
        }

        ranks.set(player.userId, playerRanks);
    }

    return ranks;
}

/**
 * The house the player chose most, or if there are no in-game stats, the house in most of the decks they played
 * @param {object} summary From summarise()
 * @param {{DeckId?: number}[]} rows The rows the summary was built from
 * @param {Map<number, string[]>} deckHouses Houses by deck id
 */
function favouriteHouse(summary, rows, deckHouses) {
    const chosen = Object.entries(summary.detailed?.houses || {});
    if (chosen.length > 0) {
        const [house, count] = chosen.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
        return { house, count, source: 'chosen' };
    }

    const games = {};
    for (const row of rows) {
        for (const house of deckHouses.get(row.DeckId) || []) {
            games[house] = (games[house] || 0) + 1;
        }
    }

    const fromDecks = Object.entries(games).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    if (fromDecks.length === 0) {
        return null;
    }

    return { house: fromDecks[0][0], count: fromDecks[0][1], source: 'decks' };
}

/**
 * Builds a player's Wrapped snapshot from their games in the period
 * @param {object} options
 * @param {number} options.year
 * @param {string} options.from
 * @param {string} options.to
 * @param {object[]} options.rows The player's game rows, from UserStatsService.getGameRows
 * @param {Map<number, string[]>} options.deckHouses Houses for the decks in the rows, by deck id
 * @param {object} options.ranks The player's ranks from rankPlayers
 * @param {object} options.site Totals across all players
 */
function buildWrapped({ year, from, to, rows, deckHouses, ranks, site }) {
    const summary = summarise(rows);

    const byMonth = new Array(12).fill(0);
    for (const [day, count] of Object.entries(summary.byDay)) {
        byMonth[Number(day.slice(5, 7)) - 1] += count;
    }

    // When games started (UTC) by month and quarter of an hour, so the page can show the time of day in the
    // viewer's timezone using each month's own offset (daylight saving, and half and quarter hour zones)
    const startTimes = Array.from({ length: 12 }, () => new Array(96).fill(0));
    for (const row of rows) {
        startTimes[Number(row.Day.slice(5, 7)) - 1][row.QuarterHour]++;
    }

    const topDeck = summary.decks[0]
        ? { ...summary.decks[0], houses: deckHouses.get(summary.decks[0].deckId) || [] }
        : null;

    return {
        ...summary,
        version: WrappedVersion,
        year,
        from,
        to,
        byMonth,
        startTimes,
        topDeck,
        favouriteHouse: favouriteHouse(summary, rows, deckHouses),
        ranks,
        site
    };
}

class WrappedService {
    constructor() {
        this.userStatsService = new UserStatsService();
    }

    /**
     * Every active player's totals for the period, for players with enough games to get a Wrapped
     * @param {string} from
     * @param {string} to
     * @returns {Promise<PlayerTotals[]>}
     */
    async getEligiblePlayers(from, to) {
        const rows = await db.query(
            'SELECT gp."PlayerId", u."Username", count(*) AS "Games", ' +
                'count(*) FILTER (WHERE gp."PlayerId" = g."WinnerId") AS "Wins", ' +
                `count(*) FILTER (WHERE ${DominantWinSql}) AS "DominantWins" ` +
                'FROM "GamePlayers" gp ' +
                'JOIN "Games" g ON g."Id" = gp."GameId" ' +
                'JOIN "Users" u ON u."Id" = gp."PlayerId" ' +
                'LEFT JOIN "GamePlayers" opp ON opp."GameId" = gp."GameId" AND opp."PlayerId" <> gp."PlayerId" ' +
                `WHERE ${FinishedInRangeSql} AND NOT u."Disabled" ` +
                'GROUP BY gp."PlayerId", u."Username" ' +
                'HAVING count(*) >= $3',
            [from, to, MinGames]
        );

        // Postgres returns counts as strings
        return rows.map((row) => ({
            userId: row.PlayerId,
            username: row.Username,
            games: Number(row.Games),
            wins: Number(row.Wins),
            dominantWins: Number(row.DominantWins)
        }));
    }

    /**
     * Totals across every player, for context ("one of N players")
     * @param {string} from
     * @param {string} to
     */
    async getSiteTotals(from, to) {
        const [totals] = await db.query(
            'SELECT count(DISTINCT g."Id") AS "Games", count(DISTINCT gp."PlayerId") AS "Players", ' +
                'to_char(min(g."StartedAt") FILTER (WHERE gp."Stats" IS NOT NULL), \'YYYY-MM-DD\') AS "DetailedFrom" ' +
                'FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" ' +
                `WHERE ${FinishedInRangeSql}`,
            [from, to]
        );

        const houses = await db.query(
            'SELECT h.key AS "House", sum(h.value::int) AS "Turns" ' +
                'FROM "Games" g JOIN "GamePlayers" gp ON gp."GameId" = g."Id" ' +
                'CROSS JOIN LATERAL jsonb_each_text(gp."Stats"->\'housesChosen\') h ' +
                `WHERE ${FinishedInRangeSql} AND gp."Stats" IS NOT NULL ` +
                'GROUP BY h.key ORDER BY "Turns" DESC, h.key LIMIT 1',
            [from, to]
        );

        return {
            games: Number(totals?.Games) || 0,
            players: Number(totals?.Players) || 0,
            detailedFrom: totals?.DetailedFrom || null,
            topHouse: houses[0]?.House || null
        };
    }

    /**
     * @param {number[]} deckIds
     * @returns {Promise<Map<number, string[]>>}
     */
    async getDeckHouses(deckIds) {
        const houses = new Map();
        if (deckIds.length === 0) {
            return houses;
        }

        const rows = await db.query(
            'SELECT dh."DeckId", h."Code" FROM "DeckHouses" dh JOIN "Houses" h ON h."Id" = dh."HouseId" ' +
                'WHERE dh."DeckId" = ANY($1) ORDER BY h."Code"',
            [deckIds]
        );

        for (const row of rows) {
            if (!houses.has(row.DeckId)) {
                houses.set(row.DeckId, []);
            }

            houses.get(row.DeckId).push(row.Code);
        }

        return houses;
    }

    /**
     * Works out and saves the Wrapped snapshot for every eligible player (or one player), for the year up to `to`.
     * Saving again replaces the snapshot but keeps when it was emailed, so nobody is emailed twice.
     * @param {object} options
     * @param {number} options.year
     * @param {string} options.to End of the period (exclusive), YYYY-MM-DD, no later than the end of the year
     * @param {string} [options.username] Only this player
     * @param {boolean} [options.dryRun] Work everything out but don't save it
     * @param {(message: string) => void} [options.progress]
     * @returns {Promise<{eligible: number, saved: number, failed: number, sample?: object}>}
     */
    async generate({ year, to, username, dryRun = false, progress = () => {} }) {
        const from = `${year}-01-01`;

        const players = await this.getEligiblePlayers(from, to);
        progress(`${players.length} players with ${MinGames}+ games from ${from} to ${to}`);

        const ranks = rankPlayers(players);
        const site = await this.getSiteTotals(from, to);
        progress(
            `Site: ${site.games} games, ${site.players} players, detailed stats from ${site.detailedFrom}`
        );

        const targets = username
            ? players.filter((player) => player.username.toLowerCase() === username.toLowerCase())
            : players;
        if (username && targets.length === 0) {
            throw new Error(`${username} doesn't have ${MinGames}+ games in this period`);
        }

        const result = { eligible: players.length, saved: 0, failed: 0 };
        let next = 0;

        const worker = async () => {
            while (next < targets.length) {
                const player = targets[next++];

                try {
                    const rows = await this.userStatsService.getGameRows(player.userId, from, to);
                    const deckIds = [...new Set(rows.map((row) => row.DeckId).filter(Boolean))];
                    const wrapped = buildWrapped({
                        year,
                        from,
                        to,
                        rows,
                        deckHouses: await this.getDeckHouses(deckIds),
                        ranks: ranks.get(player.userId),
                        site
                    });

                    if (!dryRun) {
                        await this.save(player.userId, wrapped);
                    }

                    result.saved++;
                    result.sample = result.sample || wrapped;
                } catch (err) {
                    result.failed++;
                    logger.error(`Failed to generate Wrapped for ${player.username}`, err);
                }

                if ((result.saved + result.failed) % 100 === 0) {
                    progress(`${result.saved + result.failed} of ${targets.length}`);
                }
            }
        };

        await Promise.all(Array.from({ length: Concurrency }, worker));

        // Players only have one Wrapped, so generating everyone's removes earlier years'
        if (!dryRun && !username) {
            await db.query('DELETE FROM "UserWrapped" WHERE "Year" < $1', [year]);
        }

        return result;
    }

    async save(userId, wrapped) {
        await db.query(
            'INSERT INTO "UserWrapped" ("UserId", "Year", "Version", "Data", "GeneratedAt") ' +
                "VALUES ($1, $2, $3, $4, now() AT TIME ZONE 'UTC') " +
                'ON CONFLICT ("UserId", "Year") DO UPDATE SET "Version" = EXCLUDED."Version", "Data" = EXCLUDED."Data", "GeneratedAt" = EXCLUDED."GeneratedAt"',
            [userId, wrapped.year, wrapped.version, JSON.stringify(wrapped)]
        );
    }

    /**
     * @param {number} userId
     * @param {number|string} year
     * @returns {Promise<{wrapped: object}|{expired: true}|null>} The player's snapshot, whether it has expired, or
     * null if they don't have one
     */
    async getForUser(userId, year) {
        if (!YearPattern.test(String(year))) {
            return null;
        }

        const rows = await db.query(
            // An older snapshot doesn't have everything the page needs; it's made again by re-running the script
            `SELECT "Data", "GeneratedAt" > (now() AT TIME ZONE 'UTC') - ${AvailableForSql} AS "Available" ` +
                'FROM "UserWrapped" WHERE "UserId" = $1 AND "Year" = $2 AND "Version" = $3',
            [userId, Number(year), WrappedVersion]
        );

        if (!rows[0]) {
            return null;
        }

        if (!rows[0].Available) {
            return { expired: true };
        }

        // Opponents are named now, not when the snapshot was made, in case their account has gone since
        return { wrapped: await this.userStatsService.withOpponentNames(rows[0].Data) };
    }
}

module.exports = WrappedService;
module.exports.buildWrapped = buildWrapped;
module.exports.rankPlayers = rankPlayers;
module.exports.topPercent = topPercent;
module.exports.MinGames = MinGames;
module.exports.AvailableForSql = AvailableForSql;
module.exports.WrappedVersion = WrappedVersion;
