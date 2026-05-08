describe('Flamethrower', function () {
    describe("Flamethrower's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['flamethrower']
                },
                player2: {
                    inPlay: ['zorg', 'batdrone', 'dextre']
                }
            });
        });

        it('should deal 1 damage to a creature with 1 splash damage on action', function () {
            this.player1.useAction(this.flamethrower);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.batdrone);
            expect(this.zorg.damage).toBe(1);
            expect(this.batdrone.damage).toBe(1);
            expect(this.dextre.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
