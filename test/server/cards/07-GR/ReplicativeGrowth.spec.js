describe('Replicative Growth', function () {
    describe("Replicative Growth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['replicative-growth'],
                    inPlay: ['echofly']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('moves 1 amber from each creature on reap', function () {
            this.echofly.amber = 1;
            this.player1.play(this.replicativeGrowth);
            this.player1.reap(this.echofly);
            expect(this.player1.amber).toBe(4);
            expect(this.echofly.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if no amber on creature', function () {
            this.player1.play(this.replicativeGrowth);
            this.player1.reap(this.echofly);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
