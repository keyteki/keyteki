describe('Refined Adhesive', function () {
    describe("Refined Adhesive's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['refined-adhesive', 'bomb-arang'],
                    inPlay: ['flaxia']
                },
                player2: {
                    hand: ['dust-pixie', 'hunting-witch']
                }
            });
        });

        it('should capture discarded cards from both players', function () {
            this.player1.playUpgrade(this.refinedAdhesive, this.flaxia);
            this.player1.scrap(this.bombArang);
            expect(this.bombArang.location).toBe('under');
            expect(this.flaxia.childCards).toContain(this.bombArang);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.scrap(this.huntingWitch);
            expect(this.huntingWitch.location).toBe('under');
            expect(this.flaxia.childCards).toContain(this.huntingWitch);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
