describe('Decadence', function () {
    describe('when no creatures in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    hand: ['decadence']
                },
                player2: {
                    amber: 4,
                    hand: []
                }
            });

            this.player1.play(this.decadence);
        });

        it('should not prompt', function () {
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe('when there are creatures in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    hand: ['decadence'],
                    inPlay: ['senator-shrix', 'dextre']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'lamindra', 'fidgit']
                }
            });

            this.fidgit.amber = 1;
            this.senatorShrix.amber = 1;
            this.player1.play(this.decadence);
        });

        it('should prompt for choices', function () {
            expect(this.player1).toHavePromptButton('Exalt, ready and use');
            expect(this.player1).toHavePromptButton('Move 1 amber');
        });

        describe('choose to exalt a friendly creature', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Exalt, ready and use');
            });

            it('should be able to select own creatures', function () {
                expect(this.player1).toBeAbleToSelect(this.senatorShrix);
                expect(this.player1).toBeAbleToSelect(this.dextre);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);
                expect(this.player1).not.toBeAbleToSelect(this.lamindra);
                expect(this.player1).not.toBeAbleToSelect(this.fidgit);
            });

            describe('and a creture is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.dextre);
                });

                it('should be able to use it', function () {
                    this.player1.clickPrompt('Reap with this creature');
                    this.player1.endTurn();
                });
            });
        });

        describe('choose to move 1 amber', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Move 1 amber');
            });

            it('should be able to select any creature', function () {
                expect(this.player1).toBeAbleToSelect(this.senatorShrix);
                expect(this.player1).toBeAbleToSelect(this.dextre);
                expect(this.player1).toBeAbleToSelect(this.murkens);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.fidgit);
            });

            describe('and a creture with no amber is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.dextre);
                });

                it('should be able to end turn', function () {
                    expect(this.dextre.amber).toBe(0);
                    this.player1.endTurn();
                });
            });

            describe('and a creture with amber is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.senatorShrix);
                });

                it('should be able to select another creature', function () {
                    expect(this.player1).toHavePrompt('Choose another creature');
                    expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                    expect(this.player1).toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.murkens);
                    expect(this.player1).toBeAbleToSelect(this.lamindra);
                    expect(this.player1).toBeAbleToSelect(this.fidgit);
                });

                describe('and another creture is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.lamindra);
                    });

                    it('should move 1 amber', function () {
                        expect(this.senatorShrix.amber).toBe(0);
                        expect(this.lamindra.amber).toBe(1);
                        this.player1.endTurn();
                    });
                });
            });
        });
    });
});
