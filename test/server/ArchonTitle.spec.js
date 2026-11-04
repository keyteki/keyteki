const { archonTitle } = require('../../server/services/ArchonTitle');

const snapshot = (overrides = {}) => ({
    games: 40,
    wins: 20,
    dominantWins: 2,
    favouriteHouse: { house: 'logos', count: 30, source: 'chosen' },
    detailed: null,
    site: {},
    ...overrides
});

const detailed = (overrides = {}) => ({
    games: 10,
    amberStolen: 10,
    amberCaptured: 10,
    enemyCreaturesDestroyed: 40,
    reaps: 50,
    fights: 40,
    ...overrides
});

describe('archonTitle', function () {
    it('should pick the in-game stat furthest above the site average', function () {
        const title = archonTitle(
            snapshot({
                detailed: detailed({ amberStolen: 20, enemyCreaturesDestroyed: 120 }),
                site: {
                    averages: {
                        amberStolen: 1,
                        amberCaptured: 1,
                        enemyCreaturesDestroyed: 4,
                        reaps: 5,
                        fights: 4
                    }
                }
            })
        );

        expect(title.key).toBe('brawler');
        expect(title.house).toBe('brobnar');
        expect(title.count).toBe(120);
    });

    it('should use default averages when the snapshot has none', function () {
        const title = archonTitle(snapshot({ detailed: detailed({ amberStolen: 30 }) }));

        expect(title.key).toBe('thief');
        expect(title.count).toBe(30);
    });

    it('should not give a style title for playing about as much as the average', function () {
        const title = archonTitle(snapshot({ detailed: detailed() }));

        expect(title.key).toBe('seasoned');
    });

    it('should not give a style title from too few games with in-game stats', function () {
        const title = archonTitle(snapshot({ detailed: detailed({ games: 1, amberStolen: 3 }) }));

        expect(title.key).toBe('seasoned');
    });

    it('should compare stats with different averages fairly', function () {
        // Twice the average of both: doubling a common stat is the rarer feat, though the raw ratios are equal
        const title = archonTitle(
            snapshot({ detailed: detailed({ amberStolen: 20, reaps: 100 }) })
        );

        expect(title.key).toBe('harvester');
    });

    it('should give the Unbroken Vault for a high share of dominant wins', function () {
        const title = archonTitle(snapshot({ wins: 20, dominantWins: 8 }));

        expect(title.key).toBe('vault');
        expect(title.count).toBe(8);
    });

    it('should not give the Unbroken Vault from too few wins', function () {
        const title = archonTitle(snapshot({ wins: 4, dominantWins: 4 }));

        expect(title.key).toBe('seasoned');
    });

    it('should fall back to a seasoned Archon of their favourite house', function () {
        const title = archonTitle(snapshot());

        expect(title).toEqual(
            expect.objectContaining({ key: 'seasoned', house: 'logos', count: 40 })
        );
    });
});
