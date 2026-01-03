describe('Lorica Infantry', function () {
    describe("Lorica Infantry's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['lorica-infantry']
                },
                player2: {
                    amber: 4,
                    inPlay: ['urchin']
                }
            });
        });

        it('should exalt and make opponent lose 2 amber', function () {
            this.player1.fightWith(this.loricaInfantry, this.urchin);
            this.player1.clickCard(this.loricaInfantry);
            expect(this.loricaInfantry.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not make opponent lose amber if exalt is declined', function () {
            this.player1.fightWith(this.loricaInfantry, this.urchin);
            this.player1.clickPrompt('Done');
            expect(this.loricaInfantry.tokens.amber).toBeUndefined();
            expect(this.player2.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
