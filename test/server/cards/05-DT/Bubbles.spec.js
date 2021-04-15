describe('Bubbles', function () {
    describe("Bubbles' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should move the enemy creature to top of deck.', function () {
            this.player1.play(this.bubbles);

            expect(this.player1).not.toBeAbleToSelect(this.bubbles);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.krump);
            expect(this.player2.player.cardsInPlay).not.toContain(this.krump);
            expect(this.player2.deck[0]).toBe(this.krump);
        });
    });
});
