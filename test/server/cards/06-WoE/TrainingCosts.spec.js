describe('Training Costs', function () {
    describe("Training Costs's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    hand: ['training-costs']
                }
            });
        });

        it('prevents it from being discarded', function () {
            this.player1.clickCard(this.trainingCosts);
            expect(this.player1).not.toHavePrompt('Discard');
        });

        it('causes 2 amber loss', function () {
            this.player1.play(this.trainingCosts);
            expect(this.player1.amber).toBe(0);
            expect(this.trainingCosts.location).toBe('discard');
        });

        it('gets shuffled back in with 0 amber', function () {
            this.player1.amber = 0;
            this.player1.play(this.trainingCosts);
            expect(this.player1.amber).toBe(0);
            expect(this.trainingCosts.location).toBe('deck');
        });

        it('gets shuffled back in with 1 amber', function () {
            this.player1.amber = 1;
            this.player1.play(this.trainingCosts);
            expect(this.player1.amber).toBe(0);
            expect(this.trainingCosts.location).toBe('deck');
        });
    });
});
