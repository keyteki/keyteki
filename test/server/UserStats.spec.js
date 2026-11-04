const db = require('../../server/db');
const UserStatsService = require('../../server/services/UserStatsService');
const { summarise, nameOpponents, monthRange, SummaryVersion } = UserStatsService;

const Alice = 101;
const Bob = 102;
const DeletedUser = 105;

const users = new Map([
    [Alice, { name: 'alice', disabled: false }],
    [Bob, { name: 'bob', disabled: false }],
    [DeletedUser, { name: 'deleted-user-105', disabled: true }]
]);

// Stats as the page gets them, with opponents named
const named = (rows) => nameOpponents(summarise(rows), users);

const game = (overrides = {}) => ({
    Day: '2026-10-12',
    Weekday: 1,
    Hour: 20,
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
    OpponentId: Alice,
    OpponentKeys: 1,
    ...overrides
});

const stats = (overrides = {}) => ({
    amberCaptured: 1,
    amberFromReaping: 4,
    amberGained: 10,
    amberLost: 2,
    amberSpentOnKeys: 18,
    amberStolen: 3,
    cards: {
        troll: { fights: 2, played: 1, reaps: 0 },
        'dust-pixie': { fights: 0, played: 2, reaps: 3 }
    },
    cardsDrawn: 20,
    cardsPlayed: 15,
    cardsPlayedByType: { action: 5, creature: 10 },
    creaturesLost: 4,
    damageDealt: 12,
    enemyCreaturesDestroyed: 5,
    fights: 2,
    housesChosen: { brobnar: 3, untamed: 2 },
    keysForged: 3,
    manualModeUsed: false,
    reaps: 3,
    turns: 6,
    ...overrides
});

describe('User stats', function () {
    describe('summarise', function () {
        it('should be empty with no games', function () {
            const summary = named([]);

            expect(summary.games).toBe(0);
            expect(summary.rival).toBeNull();
            expect(summary.nemesis).toBeNull();
            expect(summary.fastestWin).toBeNull();
            expect(summary.detailed).toBeNull();
        });

        it('should count wins, losses, keys, turns and time', function () {
            const summary = summarise([
                game(),
                game({ Won: false, Keys: 1, Turn: 8, Seconds: 900 }),
                game({ Keys: 3, Turn: 5, Seconds: 600 })
            ]);

            expect(summary.games).toBe(3);
            expect(summary.wins).toBe(2);
            expect(summary.losses).toBe(1);
            expect(summary.keysForged).toBe(7);
            expect(summary.turns).toBe(19);
            expect(summary.seconds).toBe(2700);
        });

        it('should cap the time counted for a single game', function () {
            const summary = summarise([game({ Seconds: 20 * 60 * 60 }), game({ Seconds: -5 })]);

            expect(summary.seconds).toBe(3 * 60 * 60);
        });

        it('should count dominant wins the same way as deck records', function () {
            const summary = summarise([
                game({ OpponentKeys: 0 }),
                game({ OpponentKeys: 0, WinReason: 'concede' }),
                game({ OpponentKeys: null }),
                game({ OpponentKeys: 1 }),
                game({ OpponentKeys: 0, Turn: 2 }),
                game({ OpponentKeys: 0, WinReason: 'clock' }),
                game({ OpponentKeys: 0, Won: false })
            ]);

            expect(summary.dominantWins).toBe(3);
        });

        it('should count concessions on both sides', function () {
            const summary = summarise([
                game({ WinReason: 'concede' }),
                game({ WinReason: 'concede', Won: false }),
                game({ WinReason: 'concede', Won: false })
            ]);

            expect(summary.concededByOpponent).toBe(1);
            expect(summary.concededByYou).toBe(2);
        });

        it('should find the longest win streak', function () {
            const results = [true, true, false, true, true, true, false, true];
            const summary = summarise(results.map((Won) => game({ Won })));

            expect(summary.longestWinStreak).toBe(3);
        });

        it('should find the fastest win by keys', function () {
            const summary = named([
                game({ Turn: 7 }),
                game({ Turn: 4, Day: '2026-10-14', OpponentId: Bob }),
                game({ Turn: 2, WinReason: 'concede' }),
                game({ Turn: 3, Won: false })
            ]);

            expect(summary.fastestWin).toEqual({
                turns: 4,
                day: '2026-10-14',
                deck: 'Deck A',
                opponent: 'bob'
            });
        });

        it('should group by UTC day, weekday and hour', function () {
            const summary = summarise([
                game({ Day: '2026-10-12', Weekday: 1, Hour: 0 }),
                game({ Day: '2026-10-12', Weekday: 1, Hour: 23 }),
                game({ Day: '2026-10-18', Weekday: 7, Hour: 23 })
            ]);

            expect(summary.byDay).toEqual({ '2026-10-12': 2, '2026-10-18': 1 });
            expect(summary.byWeekday).toEqual([2, 0, 0, 0, 0, 0, 1]);
            expect(summary.byHour[0]).toBe(1);
            expect(summary.byHour[23]).toBe(2);
        });

        it('should count game types', function () {
            const summary = summarise([
                game(),
                game({ GameType: 'competitive' }),
                game({ GameType: 'casual' })
            ]);

            expect(summary.gameTypes).toEqual({ casual: 2, competitive: 1 });
        });

        describe('decks', function () {
            it('should group by Master Vault id, so a deleted and re-imported deck is one deck', function () {
                const summary = summarise([
                    game({ DeckId: null, DeckName: null, OpponentKeys: 0 }),
                    game({ DeckId: 7, Won: false }),
                    game({ DeckUuid: 'deck-b', DeckId: 2, DeckName: 'Deck B' })
                ]);

                expect(summary.deckCount).toBe(2);
                expect(summary.decks[0]).toEqual({
                    uuid: 'deck-a',
                    deckId: 7,
                    name: 'Deck A',
                    games: 2,
                    wins: 1,
                    dominantWins: 1
                });
            });

            it('should group decks without a Master Vault id by their deck id', function () {
                const summary = summarise([
                    game({ DeckUuid: null, DeckId: 9, DeckName: 'My Alliance' }),
                    game({ DeckUuid: null, DeckId: 9, DeckName: 'My Alliance' })
                ]);

                expect(summary.decks).toEqual([
                    {
                        uuid: null,
                        deckId: 9,
                        name: 'My Alliance',
                        games: 2,
                        wins: 2,
                        dominantWins: 0
                    }
                ]);
            });

            it('should skip games with no known deck', function () {
                const summary = summarise([game({ DeckUuid: null, DeckId: null })]);

                expect(summary.decks).toEqual([]);
                expect(summary.games).toBe(1);
            });

            it('should list the most played decks first, at most 10', function () {
                const rows = [];
                for (let i = 0; i < 12; i++) {
                    for (let j = 0; j <= i; j++) {
                        rows.push(game({ DeckUuid: `deck-${i}`, DeckName: `Deck ${i}` }));
                    }
                }

                const summary = summarise(rows);

                expect(summary.deckCount).toBe(12);
                expect(summary.decks.length).toBe(10);
                expect(summary.decks[0].uuid).toBe('deck-11');
            });
        });

        describe('opponents', function () {
            it('should find the most played opponent and the one beating you most', function () {
                const summary = named([
                    game({ OpponentId: Alice }),
                    game({ OpponentId: Alice }),
                    game({ OpponentId: Alice }),
                    game({ OpponentId: Bob, Won: false }),
                    game({ OpponentId: Bob, Won: false })
                ]);

                expect(summary.rival).toEqual({ name: 'alice', games: 3, wins: 3 });
                expect(summary.nemesis).toEqual({ name: 'bob', games: 2, wins: 0 });
                expect(summary.opponentCount).toBe(2);
            });

            it('should have no nemesis when you never lost', function () {
                const summary = named([game(), game({ OpponentId: Bob })]);

                expect(summary.nemesis).toBeNull();
            });

            it('should leave out deleted and banned accounts', function () {
                const summary = named([
                    game({ OpponentId: DeletedUser, Won: false }),
                    game({ OpponentId: DeletedUser, Won: false }),
                    game({ OpponentId: Bob, Won: false, Turn: 3 }),
                    game({ OpponentId: DeletedUser, Turn: 3 })
                ]);

                expect(summary.rival.name).toBe('bob');
                expect(summary.nemesis.name).toBe('bob');
                expect(summary.opponents.map((opponent) => opponent.name)).toEqual(['bob']);
                expect(summary.fastestWin.opponent).toBeNull();
                expect(summary.games).toBe(4);
            });

            it("should keep opponents by id, so a summary cached before an account is deleted doesn't name it", function () {
                const summary = summarise([game(), game({ OpponentId: Bob, Turn: 3 })]);

                expect(summary.opponents).toEqual([
                    { id: Alice, games: 1, wins: 1 },
                    { id: Bob, games: 1, wins: 1 }
                ]);
                expect(summary.fastestWin.opponentId).toBe(Bob);
                expect(JSON.stringify(summary)).not.toContain('bob');

                const later = new Map(users).set(Bob, { name: 'deleted-user-102', disabled: true });
                const shown = nameOpponents(summary, later);

                expect(shown.opponents.map((opponent) => opponent.name)).toEqual(['alice']);
                expect(shown.fastestWin).toEqual({
                    turns: 3,
                    day: '2026-10-12',
                    deck: 'Deck A',
                    opponent: null
                });
            });

            it("should leave out opponents whose account doesn't exist", function () {
                const summary = nameOpponents(summarise([game({ OpponentId: 999 })]), users);

                expect(summary.opponents).toEqual([]);
                expect(summary.rival).toBeNull();
            });
        });

        describe('detailed stats', function () {
            it('should add up the per-game stats', function () {
                const summary = summarise([
                    game({ Stats: stats() }),
                    game({ Stats: stats({ housesChosen: { brobnar: 1, mars: 4 } }) }),
                    game()
                ]);

                expect(summary.detailed.games).toBe(2);
                expect(summary.detailed.amberGained).toBe(20);
                expect(summary.detailed.amberStolen).toBe(6);
                expect(summary.detailed.enemyCreaturesDestroyed).toBe(10);
                expect(summary.detailed.houses).toEqual({ brobnar: 4, untamed: 2, mars: 4 });
                expect(summary.detailed.cardsPlayedByType).toEqual({ action: 10, creature: 20 });
            });

            it('should rank cards by plays and pick the MVP by reaps and fights', function () {
                const summary = summarise([
                    game({ Stats: stats() }),
                    game({
                        Stats: stats({ cards: { troll: { fights: 5, played: 1, reaps: 0 } } })
                    })
                ]);

                expect(summary.detailed.cards).toEqual([
                    { id: 'dust-pixie', played: 2, reaps: 3, fights: 0 },
                    { id: 'troll', played: 2, reaps: 0, fights: 7 }
                ]);
                expect(summary.detailed.mvp.id).toBe('troll');
                expect(summary.detailed.cardCount).toBe(2);
            });

            it('should leave out games played in manual mode', function () {
                const summary = summarise([
                    game({ Stats: stats({ manualModeUsed: true }) }),
                    game({ Stats: stats() })
                ]);

                expect(summary.detailed.games).toBe(1);
                expect(summary.detailed.amberGained).toBe(10);
                expect(summary.games).toBe(2);
            });

            it('should be null when no game has detailed stats', function () {
                expect(summarise([game()]).detailed).toBeNull();
            });
        });
    });

    describe('monthRange', function () {
        it('should give the UTC bounds of the month', function () {
            expect(monthRange('2026-10')).toEqual({ from: '2026-10-01', to: '2026-11-01' });
            expect(monthRange('2026-12')).toEqual({ from: '2026-12-01', to: '2027-01-01' });
        });

        it('should reject anything that is not a month', function () {
            for (const month of [undefined, '', '2026-13', '2026-1', "2026-10' OR 1=1", '26-10']) {
                expect(monthRange(month)).toBeNull();
            }
        });
    });

    describe('UserStatsService', function () {
        beforeEach(function () {
            this.service = new UserStatsService();
            this.query = vi.spyOn(db, 'query');
            this.now = new Date('2026-11-15T12:00:00Z');
        });

        afterEach(function () {
            vi.restoreAllMocks();
        });

        it('should work out the current month every time without caching it', async function () {
            this.query
                .mockResolvedValueOnce([game()])
                .mockResolvedValueOnce([{ Id: Alice, Username: 'alice', Disabled: false }]);

            const summary = await this.service.getMonth(1, '2026-11', this.now);

            expect(summary.games).toBe(1);
            expect(summary.rival.name).toBe('alice');
            expect(this.query).toHaveBeenCalledTimes(2);
            expect(this.query.mock.calls[0][1]).toEqual([1, '2026-11-01', '2026-12-01']);
            expect(this.query.mock.calls[1][1]).toEqual([[Alice]]);
        });

        it('should not cache a month until a day after it ends', async function () {
            this.query.mockResolvedValue([]);

            await this.service.getMonth(1, '2026-10', new Date('2026-11-01T20:00:00Z'));

            expect(this.query).toHaveBeenCalledTimes(1);
        });

        it('should use the cached stats for a month that has ended, naming opponents as they are now', async function () {
            const cached = summarise([game(), game()]);
            this.query
                .mockResolvedValueOnce([{ Data: cached }])
                .mockResolvedValueOnce([{ Id: Alice, Username: 'alice2', Disabled: false }]);

            const summary = await this.service.getMonth(1, '2026-10', this.now);

            expect(summary.games).toBe(2);
            expect(summary.rival.name).toBe('alice2');
            expect(this.query).toHaveBeenCalledTimes(2);
            expect(this.query.mock.calls[0][1]).toEqual([1, '2026-10-01', SummaryVersion]);
        });

        it('should work out and cache a month that has ended', async function () {
            this.query
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([game(), game()])
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([{ Id: Alice, Username: 'alice', Disabled: false }]);

            const summary = await this.service.getMonth(1, '2026-10', this.now);

            expect(summary.games).toBe(2);
            expect(summary.rival.name).toBe('alice');
            const [sql, params] = this.query.mock.calls[2];
            expect(sql).toContain('INSERT INTO "UserMonthlyStats"');
            expect(params.slice(0, 3)).toEqual([1, '2026-10-01', SummaryVersion]);
            // Cached without names
            expect(JSON.parse(params[3])).toEqual(summarise([game(), game()]));
        });

        it('should not cache a month without games', async function () {
            this.query.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

            const summary = await this.service.getMonth(1, '2026-10', this.now);

            expect(summary.games).toBe(0);
            expect(this.query).toHaveBeenCalledTimes(2);
        });

        it('should still return the stats if caching them fails', async function () {
            this.query
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([game()])
                .mockRejectedValueOnce(new Error('db down'))
                .mockResolvedValueOnce([]);

            const summary = await this.service.getMonth(1, '2026-10', this.now);

            expect(summary.games).toBe(1);
        });

        it('should return null for an invalid month without querying', async function () {
            expect(await this.service.getMonth(1, 'nope', this.now)).toBeNull();
            expect(this.query).not.toHaveBeenCalled();
        });

        it('should only count finished games with a winner', async function () {
            this.query.mockResolvedValue([]);

            await this.service.getGameRows(1, '2026-10-01', '2026-11-01');
            await this.service.getMonths(1);

            for (const [sql] of this.query.mock.calls) {
                expect(sql).toContain('g."FinishedAt" IS NOT NULL AND g."WinnerId" IS NOT NULL');
            }
        });
    });
});
