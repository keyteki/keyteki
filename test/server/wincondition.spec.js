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
                    inPlay: ['flaxia'],
                    hand: ['key-charge']
                },
                player2: {
                    inPlay: ['lamindra'],
                    hand: ['data-forge']
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

                it('Winner cannot be determined', function () {
                    expect(this.game.winner).toBeUndefined();
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
                });

                it('P1 should win', function () {
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
                });

                it('P2 should win', function () {
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
                });

                it('P2 should win', function () {
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('amber after time');
                });
            });

            describe('and p1 keys === p2 keys and p1 amber > p2 amber > 6', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 8;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 7;
                    this.player2.endTurn();
                });

                it('P1 should win', function () {
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('amber after time');
                });
            });

            describe('and p1 keys === p2 keys and p2 amber > p1 amber> 6', function () {
                beforeEach(function () {
                    this.game.timeLimit.isTimeLimitReached = true;
                    this.player1.amber = 7;
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.amber = 8;
                    this.player2.endTurn();
                });

                it('P2 should win', function () {
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
                });

                it('P1 should win', function () {
                    expect(this.game.winner).toBe(this.player1.player);
                    expect(this.game.winReason).toBe('amber after time');
                });
            });
        });
    });
});
