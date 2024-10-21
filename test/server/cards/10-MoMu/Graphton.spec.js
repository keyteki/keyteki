describe('Graphton', function () {
    describe("Graphton's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['graphton'],
                    discard: ['poke']
                },
                player2: {
                    amber: 1
                }
            });

            this.player1.moveCard(this.poke, 'deck');
        });

        it('should archive the top card of the deck on reap', function () {
            this.player1.reap(this.graphton);
            expect(this.poke.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
