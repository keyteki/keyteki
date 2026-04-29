describe('Naja', function () {
    describe("Naja's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['naja']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should give 3 amber on reap', function () {
            this.player1.reap(this.naja);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
