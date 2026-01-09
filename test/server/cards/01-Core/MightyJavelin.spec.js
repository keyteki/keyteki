describe('Mighty Javelin', function () {
    describe("Mighty Javelin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['mighty-javelin', 'bumpsy']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should sacrifice itself and deal 4 damage to a creature', function () {
            this.player1.clickCard(this.mightyJavelin);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1).toHavePrompt('Mighty Javelin');
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.mightyJavelin.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
