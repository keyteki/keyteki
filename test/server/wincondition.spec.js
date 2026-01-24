describe('Win Condition', function () {
    describe('when no timer is used', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should be 3 keys', function () {
            this.player2.amber = 6;
            this.player1.endTurn();
            this.player2.clickPrompt('Red');
            this.player2.clickPrompt('shadows');

            this.player1.amber = 6;
            this.player2.endTurn();
            this.player1.clickPrompt('Red');
            this.player1.clickPrompt('untamed');

            this.player2.amber = 6;
            this.player1.endTurn();
            this.player2.clickPrompt('Blue');
            this.player2.clickPrompt('shadows');

            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            this.player2.amber = 6;
            this.player1.endTurn();

            expect(this.game.winner).toBe(this.player2.player);
            expect(this.game.winReason).toBe('keys');
        });

        it('should be 3 keys regardless of timeLimit', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');

            this.player1.amber = 6;
            this.player2.endTurn();
            this.player1.clickPrompt('Red');
            this.player1.clickPrompt('untamed');

            this.player1.endTurn();
            this.player2.clickPrompt('shadows');

            this.game.timeLimit.isTimeLimitReached = true;

            this.player1.amber = 6;
            this.player2.endTurn();
            this.player1.clickPrompt('Blue');
            this.player1.clickPrompt('untamed');

            this.player1.endTurn();
            this.player2.clickPrompt('shadows');

            this.player1.amber = 6;
            this.player2.endTurn();

            expect(this.game.winner).toBe(this.player1.player);
            expect(this.game.winReason).toBe('keys');
        });
    });

    describe('when timer is used', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia', 'dew-faerie', 'troll', 'groggins', 'zorg'],
                    hand: ['key-charge']
                },
                player2: {
                    inPlay: ['lamindra', 'keyfrog', 'keyfrog', 'keyfrog', 'dextre'],
                    hand: ['data-forge', 'eureka']
                }
            });

            this.game.useGameTimeLimit = true;
        });

        describe('and timer expires during player 1 turn', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
            });

            describe('and p1 keys === p2 keys and p1 amber === p2 amber and both are < 6', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 4;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 4;
                    this.player2.endTurn();
                });

                it('should go to first player as final tiebreaker when all else is equal', function () {
                    // Both players have equal keys (0), amber (4), chains (0), and creatures (5)
                    // First player wins as the final tiebreaker
                    expect(this.game.winner).toBe(this.game.firstPlayer);
                    expect(this.game.winReason).toBe('first player after time');
                });
            });

            describe('and p1 keys === p2 keys and p1 amber === p2 amber and p1 chains < p2 chains', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 4;
                    this.player1.chains = 0;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 4;
                    this.player2.chains = 5;
                    this.player2.endTurn();
                });

                it('P1 should win by chains tiebreaker', function () {
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('chains after time');
                });
            });

            describe('and p1 keys === p2 keys and p1 amber === p2 amber and p1 chains > p2 chains', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 4;
                    this.player1.chains = 5;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 4;
                    this.player2.chains = 0;
                    this.player2.endTurn();
                });

                it('P2 should win by chains tiebreaker', function () {
                    expect(this.game.winner).toBe(this.player2.player);
                    expect(this.game.winReason).toBe('chains after time');
                });
            });

            describe('and p1 keys === p2 keys and p1 amber === p2 amber and p1 chains === p2 chains and p1 creatures > p2 creatures', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 4;
                    // Player1 has 5 creatures, Player2 has 5
                    // Kill some of player2's creatures to make player1 have more
                    this.lamindra.tokens.damage = 10;
                    this.keyfrog.tokens.damage = 10;
                    this.game.checkGameState(true);
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 4;
                    this.player2.endTurn();
                });

                it('P1 should win by creatures tiebreaker', function () {
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('creatures after time');
                });
            });

            describe('and p1 keys === p2 keys and p1 amber === p2 amber and p1 chains === p2 chains and p1 creatures < p2 creatures', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 4;
                    // Kill some of player1's creatures to make player2 have more
                    this.flaxia.tokens.damage = 10;
                    this.troll.tokens.damage = 10;
                    this.game.checkGameState(true);
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 4;
                    this.player2.endTurn();
                });

                it('P2 should win by creatures tiebreaker', function () {
                    expect(this.game.winner).toBe(this.player2.player);
                    expect(this.game.winReason).toBe('creatures after time');
                });
            });

            describe('and p1 keys === p2 keys and p1 amber > p2 amber and both are < 6', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 4;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 1;
                    this.player2.endTurn();
                });

                it('P1 should win', function () {
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('amber after time');
                });
            });

            describe('and p1 keys === p2 keys and p1 amber < p2 amber and both are < 6', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 1;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 4;
                    this.player2.endTurn();
                });

                it('P2 should win', function () {
                    expect(this.game.winner).toBe(this.player2.player);
                    expect(this.game.winReason).toBe('amber after time');
                });
            });

            describe('and p1 keys === p2 keys and p1 amber > 6 > p2 amber', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 8;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 1;
                    this.player2.endTurn();
                    // First player forges during final key phase - must choose key color
                    this.player1.clickPrompt('Red');
                });

                it('P1 should win by keys', function () {
                    // P1 forged with 8 amber -> has 1 key, 2 amber
                    // P2 has 1 amber (not >= 6) -> no tiebreaker forge
                    // Keys: P1=1 > P2=0
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('keys after time');
                });
            });

            describe('and p1 keys === p2 keys and p2 amber > 6 > p1 amber', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 1;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 8;
                    this.player2.endTurn();
                    // First player doesn't have enough to forge in final key phase (1 amber)
                    // Tiebreaker: P2 forges at 6 (has 8 amber)
                });

                it('P2 should win by keys', function () {
                    // P1 has 1 amber -> no forge in KeyPhase
                    // P2 forges at 6 in tiebreaker (has 8) -> has 1 key, 2 amber
                    // Keys: P2=1 > P1=0
                    expect(this.game.winner).toBe(this.player2.player);
                    expect(this.game.winReason).toBe('keys after time');
                });
            });

            describe('and p1 keys === p2 keys and p1 amber > p2 amber > 6', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 9;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 8;
                    this.player2.endTurn();
                    // First player forges during final key phase - must choose key color
                    this.player1.clickPrompt('Red');
                });

                it('P1 should win by amber (both forge, P1 has more remaining)', function () {
                    // P1 forged with 9 amber -> has 1 key, 3 amber
                    // P2 forges at 6 in tiebreaker (has 8) -> has 1 key, 2 amber
                    // Keys equal, amber: P1=3 > P2=2
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('amber after time');
                });
            });

            describe('and p1 keys === p2 keys and both amber > 6 with p1 amber > p2 amber', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 8;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 7;
                    this.player2.endTurn();
                    // First player forges during final key phase - must choose key color
                    this.player1.clickPrompt('Red');
                });

                it('P1 should win by amber (both forge, P1 has more remaining)', function () {
                    // P1 forged with 8 amber -> has 1 key, 2 amber
                    // P2 forges at 6 in tiebreaker (has 7) -> has 1 key, 1 amber
                    // Keys equal, amber: P1=2 > P2=1
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('amber after time');
                });
            });

            describe('and p1 keys === p2 keys and both amber > 6 with p2 amber > p1 amber', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 7;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 8;
                    this.player2.endTurn();
                    // First player forges during final key phase - must choose key color
                    this.player1.clickPrompt('Red');
                });

                it('P2 should win by amber (both forge, P2 has more remaining)', function () {
                    // P1 forged with 7 amber -> has 1 key, 1 amber
                    // P2 forges at 6 in tiebreaker (has 8) -> has 1 key, 2 amber
                    // Keys equal, amber: P2=2 > P1=1
                    expect(this.game.winner).toBe(this.player2.player);
                    expect(this.game.winReason).toBe('amber after time');
                });
            });

            describe('and p1 keys > p2 keys and p2 amber < 6', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 8;
                    this.player1.play(this.keyCharge);
                    this.player1.clickPrompt('Yes');
                    this.player1.clickPrompt('Red');
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 4;
                    this.player2.endTurn();
                });

                it('P2 should win', function () {
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('keys after time');
                });
            });

            describe('and p1 keys > p2 keys and p2 amber > p1 amber after forge', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 8;
                    this.player1.play(this.keyCharge);
                    this.player1.clickPrompt('Yes');
                    this.player1.clickPrompt('Red');
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 12;
                    this.player2.endTurn();
                });

                it('P2 should win', function () {
                    expect(this.game.winner).toBe(this.player2.player);
                    expect(this.game.winReason).toBe('amber after time');
                });
            });

            describe('and p2 keys > p1 keys and p1 amber > p2 amber after forge', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 8;
                    this.player1.endTurn();
                    this.player2.clickPrompt('logos');
                    this.player2.amber = 11;
                    this.player2.play(this.dataForge);
                    this.player2.clickPrompt('Yes');
                    this.player2.clickPrompt('Red');
                    this.player2.endTurn();
                    // First player forges during final key phase - must choose key color
                    this.player1.clickPrompt('Yellow');
                });

                it('P1 should win by amber (both have 1 key, P1 has more amber)', function () {
                    // P1 forged with 8 amber -> has 1 key, 2 amber
                    // P2 forged with dataForge -> has 1 key, 1 amber (after tiebreaker forge at 6)
                    // Keys equal (1 each), amber: P1=2 > P2=1
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('amber after time');
                });
            });
        });
    });
});
