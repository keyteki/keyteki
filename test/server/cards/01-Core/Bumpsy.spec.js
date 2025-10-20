describe('Bumpsy', function () {
    describe("Bumpsy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['bumpsy']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should make opponent lose 1 amber on play', function () {
            this.player1.play(this.bumpsy);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
