describe('Full Moon', function () {
    describe("Full Moon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['full-moon', 'dust-pixie', 'dew-faerie']
                },
                player2: {}
            });
        });

        it('should gain 1 amber each time a creature is played after Full Moon', function () {
            this.player1.play(this.fullMoon);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.dustPixie);
            expect(this.player1.amber).toBe(3);
            this.player1.play(this.dewFaerie);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
