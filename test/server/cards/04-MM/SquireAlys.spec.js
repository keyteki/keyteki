describe('Squire Alys', function () {
    describe("Squire Alys's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['squire-alys']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('captures 2A on play', function () {
            this.player1.play(this.squireAlys);
            expect(this.squireAlys.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
