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

    describe("Training Costs's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    hand: [
                        'training-costs',
                        'training-costs',
                        'training-costs',
                        'training-costs',
                        'training-costs',
                        'training-costs'
                    ]
                },
                player2: {
                    hand: ['mind-barb']
                }
            });
        });

        it('does not prevent opponent from discarding it', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.mindBarb);
            expect(this.player1.player.discard[0].name).toBe('Training Costs');
        });
    });
});
