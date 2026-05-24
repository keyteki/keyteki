describe('Techno-Knight', function () {
    describe("Techno-Knight's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['techno-knight'],
                    hand: ['troll']
                },
                player2: {}
            });
        });

        it('discards a card and draws a card on reap', function () {
            const handBefore = this.player1.hand.length;
            const deckBefore = this.player1.deck.length;
            this.player1.reap(this.technoKnight);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1.hand.length).toBe(handBefore);
            expect(this.player1.deck.length).toBe(deckBefore - 1);
        });
    });
});
