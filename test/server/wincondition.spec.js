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

                it('players should be prompted to select house', function () {
                    expect(this.player1).toHavePrompt('Choose a house');
                    expect(this.player1).toHavePromptButton('brobnar');
                    expect(this.player1).toHavePromptButton('untamed');
                    expect(this.player1).toHavePromptButton('mars');
                    expect(this.player2).toHavePrompt('Choose a house');
                    expect(this.player2).toHavePromptButton('logos');
                    expect(this.player2).toHavePromptButton('untamed');
                    expect(this.player2).toHavePromptButton('shadows');
                });

                describe('and p1 creatures in play > p2 creatures in play and no bonus amber in hand', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('untamed');
                        this.player2.clickPrompt('shadows');
                    });

                    it('P1 should win', function () {
                        expect(this.game.winner).toBe(this.player1.player);
                        expect(this.game.winReason).toBe('house after time');
                    });
                });

                describe('and p2 creatures in play > p1 creatures in play and no bonus amber in hand', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('mars');
                        this.player2.clickPrompt('untamed');
                    });

                    it('P2 should win', function () {
                        expect(this.game.winner).toBe(this.player2.player);
                        expect(this.game.winReason).toBe('house after time');
                    });
                });

                describe('and p1 creatures in play === p2 creatures in play and p2 bonus amber in hand > p1', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('mars');
                        this.player2.clickPrompt('logos');
                    });

                    it('P2 should win', function () {
                        expect(this.game.winner).toBe(this.player2.player);
                        expect(this.game.winReason).toBe('house after time');
                    });
                });

                describe('and p1 creatures in play === p2 creatures in play and no bonus amber', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('mars');
                        this.player2.clickPrompt('shadows');
                    });

                    it('Winner is first player', function () {
                        expect(this.game.winner).toBe(this.game.firstPlayer);
                        expect(this.game.winReason).toBe('first player after time');
                    });
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
