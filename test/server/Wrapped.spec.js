const db = require('../../server/db');
const WrappedService = require('../../server/services/WrappedService');
const { buildWrapped, rankPlayers, topPercent, MinGames, WrappedVersion } = WrappedService;

const game = (overrides = {}) => ({
    Day: '2026-03-12',
    Weekday: 4,
    Hour: 20,
    QuarterHour: 81,
    Seconds: 1200,
    GameType: 'casual',
    GameFormat: 'normal',
    WinReason: 'keys',
    Won: true,
    Turn: 6,
    Keys: 3,
    Stats: null,
    DeckUuid: 'deck-a',
    DeckId: 1,
    DeckName: 'Deck A',
    OpponentId: 101,
    OpponentKeys: 1,
    ...overrides
});

const player = (userId, games, wins, dominantWins = 0) => ({
    userId,
    username: `player${userId}`,
    games,
    wins,
    dominantWins
});

describe('Wrapped', function () {
    describe('topPercent', function () {
        it('should put the best player in the top 1%', function () {
            const values = Array.from({ length: 200 }, (_, index) => 200 - index);

            expect(topPercent(values, 200)).toBe(1);
        });

        it('should give the rank as a percentage of players, rounded up', function () {
            const values = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

            expect(topPercent(values, 9)).toBe(20);
            expect(topPercent(values, 1)).toBe(100);
        });

        it('should give tied players the better rank', function () {
            expect(topPercent([5, 5, 5, 1], 5)).toBe(25);
        });
    });

    describe('rankPlayers', function () {
        it('should rank games, wins, win rate and dominant wins separately', function () {
            const ranks = rankPlayers([
                player(1, 100, 40, 2),
                player(2, 20, 18, 9),
                player(3, 50, 25, 4),
                player(4, 10, 2, 0)
            ]);

            expect(ranks.get(1)).toEqual({ games: 25, wins: 25, winRate: 75, dominantWins: 75 });
            expect(ranks.get(2)).toEqual({ games: 75, wins: 75, winRate: 25, dominantWins: 25 });
        });
    });

    describe('buildWrapped', function () {
        beforeEach(function () {
            this.options = {
                year: 2026,
                from: '2026-01-01',
                to: '2026-12-15',
                rows: [],
                deckHouses: new Map(),
                ranks: { games: 10, wins: 20, winRate: 30, dominantWins: 40 },
                site: { games: 1000, players: 50, detailedFrom: '2026-10-11', topHouse: 'brobnar' }
            };
        });

        it('should include the summary, period, ranks and site totals', function () {
            const wrapped = buildWrapped({ ...this.options, rows: [game(), game({ Won: false })] });

            expect(wrapped.version).toBe(WrappedVersion);
            expect(wrapped.year).toBe(2026);
            expect(wrapped.from).toBe('2026-01-01');
            expect(wrapped.to).toBe('2026-12-15');
            expect(wrapped.games).toBe(2);
            expect(wrapped.wins).toBe(1);
            expect(wrapped.ranks).toBe(this.options.ranks);
            expect(wrapped.site).toBe(this.options.site);
        });

        it('should keep when games started by month and quarter of an hour', function () {
            const wrapped = buildWrapped({
                ...this.options,
                rows: [
                    game({ Day: '2026-01-31', QuarterHour: 0 }),
                    game({ Day: '2026-01-02', QuarterHour: 0 }),
                    game({ Day: '2026-07-04', QuarterHour: 95 })
                ]
            });

            expect(wrapped.startTimes.length).toBe(12);
            expect(wrapped.startTimes[0][0]).toBe(2);
            expect(wrapped.startTimes[6][95]).toBe(1);
            expect(wrapped.startTimes.flat().reduce((total, count) => total + count)).toBe(3);
        });

        it('should count games by month', function () {
            const wrapped = buildWrapped({
                ...this.options,
                rows: [
                    game({ Day: '2026-01-31' }),
                    game({ Day: '2026-03-01' }),
                    game({ Day: '2026-03-12' }),
                    game({ Day: '2026-12-14' })
                ]
            });

            expect(wrapped.byMonth).toEqual([1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
        });

        it('should give the most played deck with its houses', function () {
            const wrapped = buildWrapped({
                ...this.options,
                rows: [game(), game(), game({ DeckUuid: 'deck-b', DeckId: 2, DeckName: 'Deck B' })],
                deckHouses: new Map([[1, ['brobnar', 'dis', 'logos']]])
            });

            expect(wrapped.topDeck).toEqual({
                uuid: 'deck-a',
                deckId: 1,
                name: 'Deck A',
                games: 2,
                wins: 2,
                dominantWins: 0,
                houses: ['brobnar', 'dis', 'logos']
            });
        });

        it('should give no houses for a deck that has been deleted', function () {
            const wrapped = buildWrapped({
                ...this.options,
                rows: [game({ DeckId: null })]
            });

            expect(wrapped.topDeck.houses).toEqual([]);
        });

        it('should take the favourite house from the houses chosen in game', function () {
            const wrapped = buildWrapped({
                ...this.options,
                rows: [
                    game({ Stats: { housesChosen: { mars: 2, dis: 5 } } }),
                    game({ Stats: { housesChosen: { mars: 4 } } })
                ],
                deckHouses: new Map([[1, ['brobnar', 'dis', 'logos']]])
            });

            expect(wrapped.favouriteHouse).toEqual({ house: 'mars', count: 6, source: 'chosen' });
        });

        it('should fall back to the houses of the decks played when there are no in-game stats', function () {
            const wrapped = buildWrapped({
                ...this.options,
                rows: [game(), game(), game({ DeckId: 2 })],
                deckHouses: new Map([
                    [1, ['brobnar', 'dis', 'logos']],
                    [2, ['dis', 'mars', 'shadows']]
                ])
            });

            expect(wrapped.favouriteHouse).toEqual({ house: 'dis', count: 3, source: 'decks' });
        });

        it('should have no favourite house when nothing is known', function () {
            expect(buildWrapped({ ...this.options, rows: [game()] }).favouriteHouse).toBeNull();
        });
    });

    describe('WrappedService', function () {
        beforeEach(function () {
            this.service = new WrappedService();
            this.query = vi.spyOn(db, 'query').mockResolvedValue([]);
            this.save = vi.spyOn(this.service, 'save').mockResolvedValue();
            vi.spyOn(this.service, 'getSiteTotals').mockResolvedValue({ games: 10, players: 2 });
            vi.spyOn(this.service, 'getDeckHouses').mockResolvedValue(new Map());
            vi.spyOn(this.service.userStatsService, 'getGameRows').mockResolvedValue([game()]);
            vi.spyOn(this.service, 'getEligiblePlayers').mockResolvedValue([
                player(1, 12, 6),
                player(2, 30, 20)
            ]);
        });

        afterEach(function () {
            vi.restoreAllMocks();
        });

        it('should save a snapshot for every eligible player', async function () {
            const result = await this.service.generate({ year: 2026, to: '2026-12-15' });

            expect(result).toMatchObject({ eligible: 2, saved: 2, failed: 0 });
            expect(this.save.mock.calls.map(([userId]) => userId).sort()).toEqual([1, 2]);
            expect(this.service.userStatsService.getGameRows).toHaveBeenCalledWith(
                1,
                '2026-01-01',
                '2026-12-15'
            );
            expect(this.query).toHaveBeenCalledWith('DELETE FROM "UserWrapped" WHERE "Year" < $1', [
                2026
            ]);
        });

        it("should only remove earlier years' snapshots when generating everyone's", async function () {
            await this.service.generate({ year: 2026, to: '2026-12-15', username: 'PLAYER1' });
            await this.service.generate({ year: 2026, to: '2026-12-15', dryRun: true });

            expect(this.query).not.toHaveBeenCalled();
        });

        it('should rank a single player among everyone', async function () {
            await this.service.generate({ year: 2026, to: '2026-12-15', username: 'PLAYER1' });

            expect(this.save).toHaveBeenCalledTimes(1);
            const [userId, wrapped] = this.save.mock.calls[0];
            expect(userId).toBe(1);
            expect(wrapped.ranks.games).toBe(100);
        });

        it("should fail for a player who doesn't qualify", async function () {
            await expect(
                this.service.generate({ year: 2026, to: '2026-12-15', username: 'nobody' })
            ).rejects.toThrow(`nobody doesn't have ${MinGames}+ games in this period`);
        });

        it('should not save anything on a dry run', async function () {
            const result = await this.service.generate({
                year: 2026,
                to: '2026-12-15',
                dryRun: true
            });

            expect(this.save).not.toHaveBeenCalled();
            expect(result.saved).toBe(2);
            expect(result.sample.games).toBe(1);
        });

        it('should carry on past a player that fails', async function () {
            this.service.userStatsService.getGameRows.mockRejectedValueOnce(new Error('db down'));

            const result = await this.service.generate({ year: 2026, to: '2026-12-15' });

            expect(result).toMatchObject({ saved: 1, failed: 1 });
        });

        it('should only return a snapshot made by this version, with opponents named as they are now', async function () {
            const snapshot = buildWrapped({
                year: 2026,
                from: '2026-01-01',
                to: '2026-12-15',
                rows: [game({ OpponentId: 101 })],
                deckHouses: new Map()
            });
            this.query
                .mockResolvedValueOnce([{ Data: snapshot, Available: true }])
                .mockResolvedValueOnce([{ Id: 101, Username: 'alice', Disabled: true }]);

            const { wrapped } = await this.service.getForUser(1, 2026);

            expect(this.query.mock.calls[0][0]).toContain('"Version" = $3');
            expect(this.query.mock.calls[0][1]).toEqual([1, 2026, WrappedVersion]);
            expect(wrapped.rival).toBeNull();
            expect(wrapped.opponentCount).toBe(0);
        });

        it('should return nothing when the player has no snapshot', async function () {
            this.query.mockResolvedValueOnce([]);

            expect(await this.service.getForUser(1, 2026)).toBeNull();
        });

        it('should say when a snapshot has expired', async function () {
            this.query.mockResolvedValueOnce([{ Data: {}, Available: false }]);

            expect(await this.service.getForUser(1, '2026')).toEqual({ expired: true });
            expect(this.query.mock.calls[0][0]).toContain("interval '2 months'");
        });

        it('should not look up a year that is not a year', async function () {
            expect(await this.service.getForUser(1, '99999999999')).toBeNull();
            expect(await this.service.getForUser(1, 'nope')).toBeNull();
            expect(this.query).not.toHaveBeenCalled();
        });

        it('should keep when a snapshot was emailed when saving it again', async function () {
            this.save.mockRestore();
            this.query.mockResolvedValue([]);

            await this.service.save(1, { year: 2026, version: WrappedVersion });

            const [sql] = this.query.mock.calls[0];
            expect(sql).toContain('ON CONFLICT ("UserId", "Year") DO UPDATE');
            expect(sql).not.toContain('EmailedAt');
        });

        it('should only make Wrapped for active players with enough games', async function () {
            this.service.getEligiblePlayers.mockRestore();
            this.query.mockResolvedValue([
                { PlayerId: 3, Username: 'carol', Games: '15', Wins: '9', DominantWins: '2' }
            ]);

            const players = await this.service.getEligiblePlayers('2026-01-01', '2026-12-15');

            expect(players).toEqual(
                [player(3, 15, 9, 2)].map((p) => ({ ...p, username: 'carol' }))
            );
            const [sql, params] = this.query.mock.calls[0];
            expect(sql).toContain('NOT u."Disabled"');
            expect(params).toEqual(['2026-01-01', '2026-12-15', MinGames]);
        });
    });
});
