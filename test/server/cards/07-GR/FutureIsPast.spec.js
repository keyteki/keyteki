describe('Future is Past', function () {
    describe("Future is Past's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['future-is-past'],
                    discard: ['charette', 'sinder']
                },
                player2: {
                    discard: ['flaxia', 'full-moon']
                }
            });
        });

        it('swaps deck and discard for each player and shuffles deck', function () {
            let p1deck = this.player1.player.deck.length;
            let p2deck = this.player2.player.deck.length;
            let shuffled = [];
            this.player1.player.game.on(
                'onDeckShuffled',
                (event) => (shuffled = shuffled.concat([event.player]))
            );
            this.player1.play(this.futureIsPast);
            expect(this.player1.player.deck.length).toBe(2);
            expect(this.charette.location).toBe('deck');
            expect(this.sinder.location).toBe('deck');
            expect(this.futureIsPast.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(p1deck + 1);
            expect(this.player2.player.deck.length).toBe(2);
            expect(this.flaxia.location).toBe('deck');
            expect(this.fullMoon.location).toBe('deck');
            expect(this.player2.player.discard.length).toBe(p2deck);
            expect(shuffled.length).toBe(2);
            expect(shuffled).toContain(this.player1.player);
            expect(shuffled).toContain(this.player2.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
