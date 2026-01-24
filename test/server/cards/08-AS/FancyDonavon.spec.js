describe('Fancy Donavon', function () {
    describe("Fancy Donavon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['fancy-donavon'],
                    inPlay: ['rowdy-skald', 'flaxia']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should ready and fight with a non-Brobnar creature on scrap', function () {
            this.flaxia.exhaust();
            this.player1.scrap(this.fancyDonavon);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.rowdySkald);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.dustPixie);
            expect(this.flaxia.tokens.damage).toBe(1);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
