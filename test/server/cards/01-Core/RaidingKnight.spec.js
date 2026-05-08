describe('Raiding Knight', function () {
    describe("Raiding Knight's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['raiding-knight']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should capture 1 amber when played', function () {
            this.player1.play(this.raidingKnight);
            expect(this.raidingKnight.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not capture if opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.play(this.raidingKnight);
            expect(this.raidingKnight.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
