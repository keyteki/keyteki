describe('Redline Rotation', function () {
    describe("Redline Rotation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    amber: 10,
                    hand: ['redline-rotation']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('should not affect amber less than 7', function () {
            this.player1.play(this.redlineRotation);
            expect(this.player1.amber).toBe(11);
            expect(this.player2.amber).toBe(6);
        });

        it('should halve opponent amber', function () {
            this.player2.amber = 8;
            this.player1.play(this.redlineRotation);
            expect(this.player1.amber).toBe(15);
            expect(this.player2.amber).toBe(4);
        });

        it('should round down the loss', function () {
            this.player2.amber = 11;
            this.player1.play(this.redlineRotation);
            expect(this.player1.amber).toBe(16);
            expect(this.player2.amber).toBe(6);
        });
    });
});
