describe('Cease Forge', function () {
    describe("Cease Forge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'staralliance',
                    hand: ['ceaseforge']
                },
                player2: {
                    amber: 5,
                    inPlay: ['dextre']
                }
            });
        });

        describe('when artifact is played', function () {
            beforeEach(function () {
                this.player1.play(this.ceaseforge);

                this.player1.amber = 7;
                this.player2.amber = 6;
            });

            it('should add 2 time counters', function () {
                expect(this.ceaseforge.tokens.time).toBe(2);
            });

            describe('at start of player 2 turn', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                });

                it('p2 should not forge', function () {
                    expect(this.player2).toHavePrompt(
                        'Choose which house you want to activate this turn'
                    );
                });

                describe('at the start of p1 turn', function () {
                    beforeEach(function () {
                        this.player2.clickPrompt('logos');
                        this.player2.endTurn();
                    });

                    it('p1 should not forge', function () {
                        expect(this.ceaseforge.tokens.time).toBe(1);
                        expect(this.player1).toHavePrompt(
                            'Choose which house you want to activate this turn'
                        );
                    });

                    describe('at start of player 2 turn again', function () {
                        beforeEach(function () {
                            this.player1.clickPrompt('staralliance');
                            this.player1.endTurn();
                        });

                        it('p2 should not forge', function () {
                            expect(this.player2).toHavePrompt(
                                'Choose which house you want to activate this turn'
                            );
                        });

                        describe('at the start of p1 turn again', function () {
                            beforeEach(function () {
                                this.player2.clickPrompt('logos');
                                this.player2.endTurn();
                            });

                            it('should destroy the artifact', function () {
                                expect(this.ceaseforge.location).toBe('discard');
                            });

                            it('p1 should forge', function () {
                                this.player1.forgeKey('red');
                                expect(this.player1.player.keys.red).toBe(true);
                                expect(this.player1.player.keys.blue).toBe(false);
                                expect(this.player1.player.keys.yellow).toBe(false);
                            });
                        });
                    });
                });
            });
        });
    });
});
