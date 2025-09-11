describe('Uncommon Currency', function () {
    describe("Uncommon Currency's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 0,
                    inPlay: ['uncommon-currency', 'potion-of-invulnerability']
                },
                player2: {
                    amber: 2,
                    inPlay: ['flaxia', 'bear-flute', 'nepenthe-seed']
                }
            });
        });

        it('should swap control with an enemy artifact', function () {
            this.player1.useAction(this.uncommonCurrency);
            expect(this.player1).not.toBeAbleToSelect(this.potionOfInvulnerability);
            expect(this.player1).toBeAbleToSelect(this.bearFlute);
            expect(this.player1).toBeAbleToSelect(this.nepentheSeed);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.nepentheSeed);
            expect(this.player1.player.cardsInPlay).toContain(this.nepentheSeed);
            expect(this.player2.player.cardsInPlay).toContain(this.uncommonCurrency);
            expect(this.nepentheSeed.controller).toBe(this.player1.player);
            expect(this.uncommonCurrency.controller).toBe(this.player2.player);
        });

        it('should do nothing if no enemy artifact', function () {
            this.player2.moveCard(this.nepentheSeed, 'discard');
            this.player2.moveCard(this.bearFlute, 'discard');
            this.player1.useAction(this.uncommonCurrency);
            expect(this.uncommonCurrency.controller).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
