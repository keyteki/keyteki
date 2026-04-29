describe('Outflank', function () {
    describe("Outflank's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'sanctum',
                    inPlay: ['alaka', 'lamindra', 'opal-knight'],
                    hand: ['outflank']
                },
                player2: {
                    amber: 4,
                    inPlay: ['badgemagus']
                }
            });
        });

        it('should capture 2 on sanctum flank creatures', function () {
            this.player1.play(this.outflank);
            expect(this.opalKnight.amber).toBe(2);
            expect(this.badgemagus.amber).toBe(2);
            expect(this.alaka.amber).toBe(0);
            expect(this.lamindra.amber).toBe(0);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
