describe('Ant110ny', function () {
    describe('Play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['ant1-10ny', 'exile'],
                    amber: 0
                },
                player2: {
                    hand: ['bad-penny'],
                    amber: 5
                }
            });
            this.player1.play(this.ant110ny);
        });

        it('should capture all enemy amber', function () {
            expect(this.player2.amber).toBe(0);
            expect(this.ant110ny.tokens.amber).toBe(5);
        });

        describe('Constant ability', function () {
            beforeEach(function () {
                this.player1.endTurn();
            });

            it('give one amber to player 2', function () {
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(1);
                expect(this.ant110ny.tokens.amber).toBe(4);
            });
            describe('Testing Exiled', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();
                    this.player1.clickPrompt('saurian');
                    this.player1.play(this.exile);
                    this.player1.clickCard(this.ant110ny);
                    this.player1.endTurn();
                });

                describe('Player 1 exiles Ant1-10ny', function () {
                    it('no amber should move', function () {
                        expect(this.player1.amber).toBe(1);
                        expect(this.player2.amber).toBe(1);
                        expect(this.ant110ny.tokens.amber).toBe(4);
                    });

                    describe('Player 2 take turns', function () {
                        beforeEach(function () {
                            this.player2.clickPrompt('shadows');
                            this.player2.endTurn();
                        });

                        it('one amber to player 1', function () {
                            expect(this.player1.amber).toBe(2);
                            expect(this.player2.amber).toBe(1);
                            expect(this.ant110ny.tokens.amber).toBe(3);
                        });
                    });
                });
            });
        });

        describe('Constant ability with no captured amber', function () {
            beforeEach(function () {
                this.ant110ny.tokens.amber = 0;
                this.player1.endTurn();
            });

            it('no amber should move', function () {
                expect(this.player2.amber).toBe(0);
                expect(this.ant110ny.tokens.amber).toBe(0);
            });
        });
    });
});
