describe('Charette', function () {
    describe("Charette's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['charette']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should capture 3 amber from opponent on play', function () {
            this.player1.play(this.charette);
            expect(this.charette.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
