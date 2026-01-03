describe('Doorstep to Heaven', function () {
    describe("Doorstep to Heaven's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'sanctum',
                    hand: ['doorstep-to-heaven']
                },
                player2: {
                    amber: 7
                }
            });
        });

        it('should make each player go down to 5 amber', function () {
            this.player1.play(this.doorstepToHeaven);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(5);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not make players with less than 6 amber lose any', function () {
            this.player1.amber = 3;
            this.player2.amber = 3;
            this.player1.play(this.doorstepToHeaven);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
