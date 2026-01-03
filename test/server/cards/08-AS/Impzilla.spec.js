describe('Impzilla', function () {
    describe("Impzilla's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['impzilla', 'kelifi-dragon']
                },
                player2: {
                    inPlay: ['troll', 'countryside-crusher', 'pelf']
                }
            });
        });

        it('should destroy most powerful enemy creature on fight', function () {
            this.player1.fightWith(this.impzilla, this.troll);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.countrysideCrusher);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.kelifiDragon);
            expect(this.player1).not.toBeAbleToSelect(this.impzilla);
            this.player1.clickCard(this.countrysideCrusher);
            expect(this.countrysideCrusher.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
