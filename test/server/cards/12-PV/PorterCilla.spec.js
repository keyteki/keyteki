describe('Porter Cilla', function () {
    describe("Porter Cilla's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['porter-cilla'],
                    hand: ['urchin']
                },
                player2: {
                    hand: ['ember-imp', 'duskwitch', 'krump']
                }
            });
        });

        it('should put a random card from opponent hand on top of their deck', function () {
            const p2DeckLength = this.player2.deck.length;
            this.player1.reap(this.porterCilla);
            expect(this.player2.player.hand.length).toBe(2);
            expect(this.player2.player.deck.length).toBe(p2DeckLength + 1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not trigger if opponent has no cards in hand', function () {
            const p2DeckLength = this.player2.deck.length;
            this.player2.moveCard(this.emberImp, 'discard');
            this.player2.moveCard(this.duskwitch, 'discard');
            this.player2.moveCard(this.krump, 'discard');
            this.player1.reap(this.porterCilla);
            expect(this.player2.deck.length).toBe(p2DeckLength);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
