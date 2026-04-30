describe('Brine Reckoning', function () {
    describe("Brine Reckoning's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['brine-reckoning'],
                    deck: ['urchin', 'urchin', 'urchin', 'urchin', 'urchin', 'urchin', 'urchin']
                },
                player2: {
                    deck: ['troll', 'troll', 'troll', 'troll', 'troll', 'troll', 'troll']
                }
            });
        });

        it('discards the top 5 cards of each deck', function () {
            this.player1.play(this.brineReckoning);
            // brine reckoning itself goes to discard, plus 5 deck cards
            expect(this.player1.player.discard.length).toBe(6);
            expect(this.player2.player.discard.length).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards as many as available when a deck has fewer than 5 cards', function () {
            this.player2.player.deck = this.player2.player.deck.slice(0, 2);
            this.player1.play(this.brineReckoning);
            expect(this.player1.player.discard.length).toBe(6);
            expect(this.player2.player.discard.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
