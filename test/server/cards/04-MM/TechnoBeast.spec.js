describe('Techno-Beast', function () {
    describe("Techno-Beast's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['techno-beast'],
                    hand: ['troll']
                },
                player2: {}
            });
        });

        it('discards a card and draws a card on reap', function () {
            const handBefore = this.player1.hand.length;
            const deckBefore = this.player1.deck.length;
            this.player1.reap(this.technoBeast);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1.hand.length).toBe(handBefore);
            expect(this.player1.deck.length).toBe(deckBefore - 1);
        });

        it('does not draw if hand is empty', function () {
            this.player1.player.moveCard(this.troll, 'discard');
            this.player1.reap(this.technoBeast);
            expect(this.player1.hand.length).toBe(0);
        });
    });
});
