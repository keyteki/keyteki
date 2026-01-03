describe('Fertility Chant', function () {
    describe("Fertility Chant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['fertility-chant']
                },
                player2: {
                    amber: 0
                }
            });
        });

        it('should cause opponent to gain 2 amber', function () {
            this.player1.play(this.fertilityChant);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
