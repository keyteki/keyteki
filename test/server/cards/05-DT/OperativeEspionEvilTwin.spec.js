describe('Operative Espion Evil Twin', function () {
    describe("Operative Espion Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['rocketeer-tryska', 'operative-espion-evil-twin', 'lamindra'],
                    hand: ['quintrino-flux']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens', 'troll', 'groggins', 'seabringer-kekoa']
                }
            });
        });

        describe('when owner raises the tide', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should opt not to deal damage to a creature', function () {
                this.player1.clickPrompt('Done');
            });

            it('should opt to deal damage to a creature', function () {
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.rocketeerTryska);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.groggins);
                this.player1.clickCard(this.troll);
                expect(this.troll.tokens.damage).toBe(3);
            });
        });

        describe('when opponent raises the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.raiseTide();
            });

            it('should opt not to deal damage to a creature', function () {
                this.player2.clickPrompt('Done');
            });

            it('should opt to deal damage to a creature', function () {
                expect(this.player2).toBeAbleToSelect(this.lamindra);
                expect(this.player2).toBeAbleToSelect(this.rocketeerTryska);
                expect(this.player2).toBeAbleToSelect(this.troll);
                expect(this.player2).toBeAbleToSelect(this.groggins);
                this.player2.clickCard(this.rocketeerTryska);
                expect(this.rocketeerTryska.tokens.damage).toBe(3);
            });
        });

        describe('when tide is raised out of turn', function () {
            beforeEach(function () {
                this.player1.play(this.quintrinoFlux);
                this.player1.clickCard(this.lamindra);
                this.player1.clickCard(this.seabringerKekoa);
            });

            it('should not prompt to use a creature', function () {
                expect(this.lamindra.location).toBe('discard');
                expect(this.seabringerKekoa.location).toBe('discard');
                expect(this.player2.isTideHigh()).toBe(true);
                expect(this.player1).isReadyToTakeAction();
                expect(this.player2).toHavePrompt('Waiting for opponent');
            });
        });
    });
});
