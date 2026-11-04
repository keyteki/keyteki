// Per game averages to compare against when a snapshot has no site averages
const DefaultAverages = {
    amberStolen: 1,
    amberCaptured: 1,
    enemyCreaturesDestroyed: 4,
    reaps: 5,
    fights: 4
};

// How far above the site's average per game a stat must be to earn its title, in standard deviations per game
// (treating each stat as a count with variance equal to its average, so rare and common stats compare fairly)
const MinScore = 0.25;

// Games with in-game stats needed before a style title is given
const MinDetailedGames = 5;

// Share of wins that must be dominant for the Unbroken Vault, from at least this many wins
const MinDominantShare = 0.3;
const MinWinsForDominantShare = 5;

/**
 * Titles earned by playing more of something than the average Archon. The page has the descriptions, so they
 * can be translated; the names here are for the email.
 * @type {{key: string, stat: string, house: string, name: string}[]}
 */
const StyleTitles = [
    { key: 'thief', stat: 'amberStolen', house: 'shadows', name: 'Shadows-touched Thief' },
    { key: 'hoarder', stat: 'amberCaptured', house: 'dis', name: 'Æmber Hoarder' },
    { key: 'brawler', stat: 'enemyCreaturesDestroyed', house: 'brobnar', name: 'Brobnar Brawler' },
    { key: 'harvester', stat: 'reaps', house: 'untamed', name: 'Untamed Harvester' },
    { key: 'gladiator', stat: 'fights', house: 'saurian', name: 'Saurian Gladiator' }
];

/**
 * Picks the title that best describes how a player played their year: the in-game stat furthest above the site's
 * average, else a high share of dominant wins, else a title for a seasoned Archon of their favourite house
 * @param {object} wrapped The snapshot from buildWrapped, without its title
 * @returns {{key: string, house: string|null, name: string, count: number}}
 */
function archonTitle(wrapped) {
    const detailed = wrapped.detailed;
    const averages = { ...DefaultAverages, ...wrapped.site?.averages };

    if (detailed?.games >= MinDetailedGames) {
        let best = null;

        for (const title of StyleTitles) {
            const average = averages[title.stat];
            const count = detailed[title.stat] || 0;
            const score = average > 0 ? (count / detailed.games - average) / Math.sqrt(average) : 0;

            if (score >= MinScore && (!best || score > best.score)) {
                best = { title, count, score };
            }
        }

        if (best) {
            return {
                key: best.title.key,
                house: best.title.house,
                name: best.title.name,
                count: best.count
            };
        }
    }

    if (
        wrapped.wins >= MinWinsForDominantShare &&
        wrapped.dominantWins / wrapped.wins >= MinDominantShare
    ) {
        return {
            key: 'vault',
            house: 'sanctum',
            name: 'Unbroken Vault',
            count: wrapped.dominantWins
        };
    }

    return {
        key: 'seasoned',
        house: wrapped.favouriteHouse?.house || null,
        name: 'Seasoned Archon',
        count: wrapped.games
    };
}

module.exports = { archonTitle, StyleTitles };
