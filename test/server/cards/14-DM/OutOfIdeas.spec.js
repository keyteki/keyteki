describe('Out of Ideas', function () {
    describe("Out of Ideas' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['out-of-ideas'],
                    discard: ['troll']
                },
                player2: {}
            });
        });

        it('shuffles itself and the top card of discard back into deck', function () {
            const deckBefore = this.player1.player.deck.length;
            this.player1.play(this.outOfIdeas);
            expect(this.outOfIdeas.location).toBe('deck');
            expect(this.troll.location).toBe('deck');
            expect(this.player1.player.deck.length).toBe(deckBefore + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Out of Ideas with empty discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['out-of-ideas']
                },
                player2: {}
            });
        });

        it('shuffles only itself when discard is empty', function () {
            const deckBefore = this.player1.player.deck.length;
            this.player1.play(this.outOfIdeas);
            expect(this.outOfIdeas.location).toBe('deck');
            expect(this.player1.player.deck.length).toBe(deckBefore + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
