describe('OperativeEspion', function () {
    describe("OperativeEspion's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['rocketeer-tryska', 'operative-espion', 'lamindra']
                },
                player2: {
                    amber: 2,
                    inPlay: ['bad-penny', 'troll', 'groggins']
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
                this.player1.clickCard(this.operativeEspion);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.rocketeerTryska);
                expect(this.player1).not.toBeAbleToSelect(this.badPenny);
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
                this.player2.clickPrompt('shadows');
                this.player2.raiseTide();
            });

            it('should opt not to use a creature', function () {
                this.player2.clickPrompt('Done');
            });

            it('should opt to use a creature they control', function () {
                this.player2.clickCard(this.operativeEspion);
                expect(this.player2).not.toBeAbleToSelect(this.lamindra);
                expect(this.player2).not.toBeAbleToSelect(this.rocketeerTryska);
                expect(this.player2).toBeAbleToSelect(this.badPenny);
                expect(this.player2).toBeAbleToSelect(this.troll);
                expect(this.player2).toBeAbleToSelect(this.groggins);
                this.player2.clickCard(this.troll);
                this.player2.clickPrompt('Reap with this creature');
                expect(this.player2.amber).toBe(3);
            });
        });
    });
});
