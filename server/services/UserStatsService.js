const logger = require('../log');
const db = require('../db');
const { isDominantWin } = require('./DominantWin');

// Bump when the shape of the summary changes, so cached months are recomputed
const SummaryVersion = 3;

// A game left open for hours (e.g. both players walked away) shouldn't count as hours played
const MaxSecondsPerGame = 3 * 60 * 60;

// Games can finish a while after they start, so a month is only cached once it's been over this long
const ClosedMonthDelayMs = 24 * 60 * 60 * 1000;

const MaxListedDecks = 10;
const MaxListedOpponents = 10;
const MaxListedCards = 10;

const MonthPattern = /^(\d{4})-(0[1-9]|1[0-2])$/;

/**
 * @typedef StatsRow One finished game from the point of view of the user, as selected by getGameRows
 * @property {string} Day UTC date the game started, YYYY-MM-DD
 * @property {number} Weekday ISO day of week the game started (1 = Monday)
 * @property {number} Hour UTC hour the game started
 * @property {number} QuarterHour UTC quarter of an hour of the day the game started (0-95)
 * @property {number} Seconds
 * @property {string} GameType
 * @property {string} GameFormat
 * @property {string} WinReason
 * @property {boolean} Won
 * @property {number} Turn
 * @property {number} Keys
 * @property {object} [Stats] Per-game stats from GameStats, only present for games since they were added
 * @property {string} [DeckUuid]
 * @property {number} [DeckId]
 * @property {string} [DeckName]
 * @property {number} [OpponentId]
 * @property {number} [OpponentKeys]
 */

const DetailedCounters = [
    'amberCaptured',
    'amberFromReaping',
    'amberGained',
    'amberLost',
    'amberSpentOnKeys',
    'amberStolen',
    'cardsDrawn',
    'cardsPlayed',
    'creaturesLost',
    'damageDealt',
    'enemyCreaturesDestroyed',
    'fights',
    'reaps'
];

function increment(counts, key, amount = 1) {
    counts[key] = (counts[key] || 0) + amount;
}

/**
 * @template T
 * @param {T[]} items
 * @param {(item: T) => number} score
 * @returns {T|null}
 */
function best(items, score) {
    let result = null;
    for (const item of items) {
        if (score(item) > 0 && (!result || score(item) > score(result))) {
            result = item;
        }
    }

    return result;
}

/**
 * Builds a user's stats from their finished games in a period. Rows must be ordered by start time.
 * Opponents are kept by user id, and only named (and deleted or banned accounts left out) by nameOpponents
 * when the stats are read, so a cached summary never shows a name that has since been removed.
 * @param {StatsRow[]} rows
 */
function summarise(rows) {
    const summary = {
        version: SummaryVersion,
        games: 0,
        wins: 0,
        losses: 0,
        dominantWins: 0,
        concededByYou: 0,
        concededByOpponent: 0,
        keysForged: 0,
        seconds: 0,
        turns: 0,
        fastestWin: null,
        longestWinStreak: 0,
        gameTypes: {},
        byDay: {},
        byWeekday: [0, 0, 0, 0, 0, 0, 0],
        byHour: new Array(24).fill(0),
        decks: [],
        deckCount: 0,
        opponents: [],
        detailed: null
    };

    const decks = new Map();
    const opponents = new Map();
    const detailed = {
        games: 0,
        houses: {},
        cardsPlayedByType: {},
        cards: {}
    };
    for (const counter of DetailedCounters) {
        detailed[counter] = 0;
    }

    let streak = 0;

    for (const row of rows) {
        summary.games++;
        summary.keysForged += row.Keys || 0;
        summary.seconds += Math.min(Math.max(row.Seconds || 0, 0), MaxSecondsPerGame);
        summary.turns += row.Turn || 0;
        increment(summary.gameTypes, row.GameType || 'unknown');
        increment(summary.byDay, row.Day);
        summary.byWeekday[row.Weekday - 1]++;
        summary.byHour[row.Hour]++;

        if (row.Won) {
            summary.wins++;
            streak++;
            summary.longestWinStreak = Math.max(summary.longestWinStreak, streak);

            if (row.WinReason === 'concede') {
                summary.concededByOpponent++;
            }

            if (isDominantWin(row)) {
                summary.dominantWins++;
            }

            // Wins by concession before anything happened aren't much of a feat
            if (
                row.WinReason === 'keys' &&
                row.Turn &&
                (!summary.fastestWin || row.Turn < summary.fastestWin.turns)
            ) {
                summary.fastestWin = {
                    turns: row.Turn,
                    day: row.Day,
                    deck: row.DeckName || null,
                    opponentId: row.OpponentId || null
                };
            }
        } else {
            summary.losses++;
            streak = 0;

            if (row.WinReason === 'concede') {
                summary.concededByYou++;
            }
        }

        const deckKey = row.DeckUuid || (row.DeckId ? `id:${row.DeckId}` : null);
        if (deckKey) {
            let deck = decks.get(deckKey);
            if (!deck) {
                deck = {
                    uuid: row.DeckUuid || null,
                    deckId: null,
                    name: null,
                    games: 0,
                    wins: 0,
                    dominantWins: 0
                };
                decks.set(deckKey, deck);
            }

            // The deck's current row, if it still exists, for looking up its houses
            deck.deckId = row.DeckId || deck.deckId;
            deck.name = row.DeckName || deck.name;
            deck.games++;
            deck.wins += row.Won ? 1 : 0;
            deck.dominantWins += isDominantWin(row) ? 1 : 0;
        }

        if (row.OpponentId) {
            let opponent = opponents.get(row.OpponentId);
            if (!opponent) {
                opponent = { id: row.OpponentId, games: 0, wins: 0 };
                opponents.set(row.OpponentId, opponent);
            }

            opponent.games++;
            opponent.wins += row.Won ? 1 : 0;
        }

        // Games played partly in manual mode don't reflect what the cards did
        if (row.Stats && !row.Stats.manualModeUsed) {
            addDetailedStats(detailed, row.Stats);
        }
    }

    const deckList = [...decks.values()].sort((a, b) => b.games - a.games || b.wins - a.wins);
    summary.decks = deckList.slice(0, MaxListedDecks);
    summary.deckCount = deckList.length;

    // Every opponent is kept, as some may be left out when they're named
    summary.opponents = [...opponents.values()];

    if (detailed.games > 0) {
        const cards = Object.entries(detailed.cards).map(([id, card]) => ({ id, ...card }));
        detailed.cards = cards
            .sort((a, b) => b.played - a.played || a.id.localeCompare(b.id))
            .slice(0, MaxListedCards);
        detailed.mvp = best(cards, (card) => card.reaps + card.fights);
        detailed.cardCount = cards.length;
        summary.detailed = detailed;
    }

    return summary;
}

/**
 * Names the opponents in a summary from summarise(), leaving out deleted (anonymised) and banned accounts, and
 * picks the rival (most games) and nemesis (most losses to)
 * @param {object} summary
 * @param {Map<number, {name: string, disabled: boolean}>} users The opponents' accounts, by id
 */
function nameOpponents(summary, users) {
    const active = (id) => users.has(id) && !users.get(id).disabled;

    const opponents = summary.opponents
        .filter((opponent) => active(opponent.id))
        .map((opponent) => ({
            name: users.get(opponent.id).name,
            games: opponent.games,
            wins: opponent.wins
        }))
        .sort((a, b) => b.games - a.games || a.name.localeCompare(b.name));

    const { opponentId, ...fastestWin } = summary.fastestWin || {};

    return {
        ...summary,
        opponents: opponents.slice(0, MaxListedOpponents),
        opponentCount: opponents.length,
        rival: opponents[0] || null,
        nemesis: best(opponents, (opponent) => opponent.games - opponent.wins),
        fastestWin: summary.fastestWin
            ? { ...fastestWin, opponent: active(opponentId) ? users.get(opponentId).name : null }
            : null
    };
}

function addDetailedStats(detailed, stats) {
    detailed.games++;

    for (const counter of DetailedCounters) {
        detailed[counter] += stats[counter] || 0;
    }

    for (const [house, count] of Object.entries(stats.housesChosen || {})) {
        increment(detailed.houses, house, count);
    }

    for (const [type, count] of Object.entries(stats.cardsPlayedByType || {})) {
        increment(detailed.cardsPlayedByType, type, count);
    }

    for (const [id, card] of Object.entries(stats.cards || {})) {
        if (!detailed.cards[id]) {
            detailed.cards[id] = { played: 0, reaps: 0, fights: 0 };
        }

        detailed.cards[id].played += card.played || 0;
        detailed.cards[id].reaps += card.reaps || 0;
        detailed.cards[id].fights += card.fights || 0;
    }
}

/**
 * @param {string} month YYYY-MM
 * @returns {{from: string, to: string}|null} UTC bounds as timestamps, so they don't depend on the server's timezone
 */
function monthRange(month) {
    const match = MonthPattern.exec(month || '');
    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const monthNumber = Number(match[2]);
    const next =
        monthNumber === 12
            ? `${year + 1}-01`
            : `${year}-${String(monthNumber + 1).padStart(2, '0')}`;

    return { from: `${month}-01`, to: `${next}-01` };
}

class UserStatsService {
    /**
     * Finished games in [from, to) from the user's side, oldest first. Times are UTC.
     * @param {number} userId
     * @param {string} from
     * @param {string} to
     * @returns {Promise<StatsRow[]>}
     */
    getGameRows(userId, from, to) {
        return db.query(
            'SELECT to_char(g."StartedAt", \'YYYY-MM-DD\') AS "Day", ' +
                'EXTRACT(ISODOW FROM g."StartedAt")::int AS "Weekday", EXTRACT(HOUR FROM g."StartedAt")::int AS "Hour", ' +
                '(EXTRACT(HOUR FROM g."StartedAt") * 4 + FLOOR(EXTRACT(MINUTE FROM g."StartedAt") / 15))::int AS "QuarterHour", ' +
                'EXTRACT(EPOCH FROM g."FinishedAt" - g."StartedAt")::int AS "Seconds", ' +
                'g."GameType", g."GameFormat", g."WinReason", g."WinnerId" = gp."PlayerId" AS "Won", ' +
                'gp."Turn", gp."Keys", gp."Stats", gp."DeckUuid", gp."DeckId", d."Name" AS "DeckName", ' +
                'opp."PlayerId" AS "OpponentId", opp."Keys" AS "OpponentKeys" ' +
                'FROM "GamePlayers" gp ' +
                'JOIN "Games" g ON g."Id" = gp."GameId" ' +
                'LEFT JOIN "GamePlayers" opp ON opp."GameId" = gp."GameId" AND opp."PlayerId" <> gp."PlayerId" ' +
                'LEFT JOIN "Decks" d ON d."Id" = gp."DeckId" ' +
                'WHERE gp."PlayerId" = $1 AND g."StartedAt" >= $2 AND g."StartedAt" < $3 ' +
                'AND g."FinishedAt" IS NOT NULL AND g."WinnerId" IS NOT NULL ' +
                'ORDER BY g."StartedAt", g."Id"',
            [userId, from, to]
        );
    }

    /**
     * Names the opponents in a summary (see nameOpponents), from their accounts as they are now
     * @param {object} summary From summarise()
     */
    async withOpponentNames(summary) {
        const ids = [
            ...new Set(
                summary.opponents
                    .map((opponent) => opponent.id)
                    .concat(summary.fastestWin?.opponentId || [])
            )
        ];
        const rows = ids.length
            ? await db.query(
                  'SELECT "Id", "Username", "Disabled" FROM "Users" WHERE "Id" = ANY($1)',
                  [ids]
              )
            : [];

        return nameOpponents(
            summary,
            new Map(rows.map((row) => [row.Id, { name: row.Username, disabled: row.Disabled }]))
        );
    }

    /**
     * The months (YYYY-MM, newest first) in which the user finished a game
     * @param {number} userId
     * @returns {Promise<string[]>}
     */
    async getMonths(userId) {
        const rows = await db.query(
            'SELECT DISTINCT to_char(g."StartedAt", \'YYYY-MM\') AS "Month" ' +
                'FROM "GamePlayers" gp JOIN "Games" g ON g."Id" = gp."GameId" ' +
                'WHERE gp."PlayerId" = $1 AND g."FinishedAt" IS NOT NULL AND g."WinnerId" IS NOT NULL ' +
                'ORDER BY "Month" DESC',
            [userId]
        );

        return rows.map((row) => row.Month);
    }

    /**
     * The user's stats for a calendar month (UTC). Months that have ended are cached, as they can't change.
     * @param {number} userId
     * @param {string} month YYYY-MM
     * @param {Date} [now]
     */
    async getMonth(userId, month, now = new Date()) {
        const range = monthRange(month);
        if (!range) {
            return null;
        }

        const isClosed = now.getTime() - Date.parse(`${range.to}T00:00:00Z`) > ClosedMonthDelayMs;

        if (isClosed) {
            const cached = await db.query(
                'SELECT "Data" FROM "UserMonthlyStats" WHERE "UserId" = $1 AND "Month" = $2 AND "Version" = $3',
                [userId, range.from, SummaryVersion]
            );

            if (cached.length > 0) {
                return this.withOpponentNames(cached[0].Data);
            }
        }

        const summary = summarise(await this.getGameRows(userId, range.from, range.to));

        if (isClosed && summary.games > 0) {
            try {
                await db.query(
                    'INSERT INTO "UserMonthlyStats" ("UserId", "Month", "Version", "Data", "ComputedAt") ' +
                        "VALUES ($1, $2, $3, $4, now() AT TIME ZONE 'UTC') " +
                        'ON CONFLICT ("UserId", "Month") DO UPDATE SET "Version" = EXCLUDED."Version", "Data" = EXCLUDED."Data", "ComputedAt" = EXCLUDED."ComputedAt"',
                    [userId, range.from, SummaryVersion, JSON.stringify(summary)]
                );
            } catch (err) {
                // The stats are still correct, they'll just be worked out again next time
                logger.error(`Failed to cache stats for user ${userId} month ${month}`, err);
            }
        }

        return this.withOpponentNames(summary);
    }
}

module.exports = UserStatsService;
module.exports.summarise = summarise;
module.exports.nameOpponents = nameOpponents;
module.exports.monthRange = monthRange;
module.exports.SummaryVersion = SummaryVersion;
