describe('Refined Adhesive', function () {
    describe("Refined Adhesive's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['refined-adhesive', 'bomb-arang', 'bux-bastian'],
                    inPlay: ['flaxia']
                },
                player2: {
                    hand: ['dust-pixie', 'hunting-witch'],
                    inPlay: ['troll']
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

        it('should stop scrap effects', function () {
            this.player1.playUpgrade(this.refinedAdhesive, this.flaxia);
            this.player1.scrap(this.buxBastian);
            expect(this.troll.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
