describe('Regrowth', function () {
    describe("Regrowth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['regrowth'],
                    discard: ['urchin', 'dust-pixie']
                },
                player2: {}
            });
        });

        it('should return a creature from discard to hand', function () {
            this.player1.play(this.regrowth);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
