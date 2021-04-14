describe('Thalassophobia', function () {
    describe("Thalassophobia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['thalassophobia']
                },
                player2: {
                    inPlay: ['narp'],
                    discard: []
                }
            });
        });

        it('should discard 10 cards', function () {
            this.player1.play(this.thalassophobia);
            expect(this.player2.discard.length).toBe(10);
        });

        it('should discard cards from the top', function () {
            this.player2.moveCard(this.narp, 'deck');
            this.player1.play(this.thalassophobia);
            expect(this.narp.location).toBe('discard');
        });

        it('should discard remaining cards if the deck has less than 10', function () {
            while (this.player2.deck.length > 5)
                this.player2.moveCard(this.player2.deck[0], 'hand');

            expect(this.player2.deck.length).toBe(5);
            this.player1.play(this.thalassophobia);
            expect(this.player2.deck.length).toBe(0);
            expect(this.player2.discard.length).toBe(5);
        });
    });
});
