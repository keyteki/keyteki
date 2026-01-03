describe('Lok the Corruptor', function () {
    describe("Lok the Corruptor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 1,
                    inPlay: ['lok-the-corruptor', 'ember-imp', 'krump', 'flaxia']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'hunting-witch', 'searine']
                }
            });
        });

        it('should make opponent lose 1 amber for each friendly Dis creature when reaping', function () {
            this.player1.reap(this.lokTheCorruptor);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
