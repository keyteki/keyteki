describe('Grisly Exchange', function () {
    describe("Grisly Exchange's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['grisly-exchange']
                },
                player2: {
                    discard: [
                        'faust-the-great',
                        'spoils-of-battle',
                        'tremor',
                        'anger',
                        'urchin',
                        'culf-the-quiet'
                    ]
                }
            });
        });

        it('can put 5 discard cards on bottom of opponent deck, and discard 5 cards of player deck', function () {
            this.player1.play(this.grislyExchange);
            let p2decklen = this.player2.player.deck.length;
            expect(this.player1.player.discard.length).toBe(6);
            expect(this.player2.player.deck[p2decklen - 1]).toBe(this.urchin);
            expect(this.player2.player.deck[p2decklen - 2]).toBe(this.anger);
            expect(this.player2.player.deck[p2decklen - 3]).toBe(this.tremor);
            expect(this.player2.player.deck[p2decklen - 4]).toBe(this.spoilsOfBattle);
            expect(this.player2.player.deck[p2decklen - 5]).toBe(this.faustTheGreat);
        });
    });
});
