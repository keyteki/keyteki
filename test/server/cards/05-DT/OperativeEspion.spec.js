describe('OperativeEspion', function () {
    describe("OperativeEspion's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['rocketeer-tryska', 'operative-espion', 'dew-faerie', 'lamindra'],
                    hand: ['quintrino-flux']
                },
                player2: {
                    amber: 2,
                    inPlay: ['replicator', 'troll', 'groggins', 'seabringer-kekoa']
                }
            });
        });

        describe('when owner raises the tide', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should opt not to use a creature', function () {
                this.player1.clickPrompt('Done');
            });

            it('should opt to use a creature they control', function () {
                expect(this.player1).toBeAbleToSelect(this.operativeEspion);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.rocketeerTryska);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.groggins);
                this.player1.clickCard(this.lamindra);
                this.player1.clickPrompt('Reap with this creature');
                expect(this.player1.amber).toBe(3);
            });
        });

        describe('when opponent raises the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.raiseTide();
            });

            it('should opt not to use a creature', function () {
                this.player2.clickPrompt('Done');
            });

            it('should opt to use a creature they control', function () {
                expect(this.player2).not.toBeAbleToSelect(this.operativeEspion);
                expect(this.player2).not.toBeAbleToSelect(this.lamindra);
                expect(this.player2).not.toBeAbleToSelect(this.rocketeerTryska);
                expect(this.player2).toBeAbleToSelect(this.troll);
                expect(this.player2).toBeAbleToSelect(this.groggins);
                expect(this.player2).toBeAbleToSelect(this.replicator);
                this.player2.clickCard(this.replicator);
                this.player2.clickPrompt('Reap with this creature');
                this.player2.clickCard(this.dewFaerie);
                expect(this.player2.amber).toBe(4);
                expect(this.player1.amber).toBe(2);
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
