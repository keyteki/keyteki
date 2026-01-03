describe('Ornar Skullface', function () {
    describe("Ornar Skullface's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['ornar-skullface'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['flaxia']
                }
            });
        });

        it('can deal 3 damage to a creature on scrap', function () {
            this.player1.scrap(this.ornarSkullface);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.tokens.damage).toBe(3);
            expect(this.troll.tokens.damage).toBe(undefined);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
