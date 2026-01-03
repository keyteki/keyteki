describe('Prop Dusting', function () {
    describe("Prop Dusting's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['prop-dusting'],
                    inPlay: ['hunting-witch', 'bosun-creen']
                },
                player2: {
                    amber: 4,
                    inPlay: ['dust-pixie', 'eldest-bear', 'troll']
                }
            });
        });

        it('should destroy an enemy flank creature', function () {
            this.player1.play(this.propDusting);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.bosunCreen);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.eldestBear);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
