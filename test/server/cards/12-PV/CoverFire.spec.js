describe('Cover Fire', function () {
    describe("Cover Fire's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['cover-fire'],
                    amber: 1
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should make opponent lose half their amber and steal 1 amber', function () {
            this.player1.play(this.coverFire);

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2); // 5 - 2 (half of 5 rounded down) - 1 (stolen)
        });

        it('should handle odd amber amounts correctly', function () {
            this.player2.amber = 7;
            this.player1.play(this.coverFire);

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3); // 7 - 3 (half of 7 rounded down) - 1 (stolen)
        });

        it('should handle zero amber correctly', function () {
            this.player2.amber = 0;
            this.player1.play(this.coverFire);

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0); // 0 - 0 (half of 0 rounded down) - 0 (can't steal from 0)
        });
    });
});
