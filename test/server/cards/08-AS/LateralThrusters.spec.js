describe('Lateral Thrusters', function () {
    describe("Lateral Thrusters's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['lateral-thrusters'],
                    inPlay: ['dust-pixie', 'hunting-witch']
                },
                player2: {
                    amber: 1,
                    inPlay: ['bosun-creen', 'bux-bastian', 'scalawag-finn', 'charette']
                }
            });
        });

        it('should let creature controller rearrange at start of turn', function () {
            this.player1.playUpgrade(this.lateralThrusters, this.bosunCreen);
            this.player1.endTurn();
            expect(this.player2).toBeAbleToSelect(this.bosunCreen);
            expect(this.player2).toBeAbleToSelect(this.buxBastian);
            expect(this.player2).toBeAbleToSelect(this.scalawagFinn);
            expect(this.player2).toBeAbleToSelect(this.charette);
            expect(this.player2).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player2).not.toBeAbleToSelect(this.huntingWitch);
            this.player2.clickCard(this.buxBastian);
            this.player2.clickCard(this.charette);
            this.player2.clickPrompt('Done');
            expect(this.player2.player.creaturesInPlay[1]).toBe(this.charette);
            expect(this.player2.player.creaturesInPlay[3]).toBe(this.buxBastian);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('skyborn');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
