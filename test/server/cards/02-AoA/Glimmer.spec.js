describe('Glimmer', function () {
    describe("Glimmer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['glimmer'],
                    discard: ['dust-pixie', 'flaxia']
                },
                player2: {}
            });
        });

        it('should return a card from discard pile to hand on play', function () {
            this.player1.play(this.glimmer);

            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.dustPixie);

            expect(this.dustPixie.location).toBe('hand');
            expect(this.flaxia.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
