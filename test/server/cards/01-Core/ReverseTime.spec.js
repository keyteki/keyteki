describe('Reverse Time', function () {
    describe("Reverse Time's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['reverse-time'],
                    discard: ['dextre', 'helper-bot', 'library-access']
                },
                player2: {}
            });
        });

        it('should swap deck and discard pile', function () {
            let deckSize = this.player1.deck.length;
            let discardSize = this.player1.discard.length;
            this.player1.play(this.reverseTime);
            expect(this.player1.deck.length).toBe(discardSize);
            expect(this.player1.discard.length).toBe(deckSize + 1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
