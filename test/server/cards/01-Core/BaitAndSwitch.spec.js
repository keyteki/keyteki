describe('Bait and Switch', function () {
    describe("Bait and Switch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 0,
                    hand: ['bait-and-switch']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it("shouldn't steal an amber if both players have equal amounts", function () {
            this.player1.amber = 1;
            this.player1.play(this.baitAndSwitch);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('should steal an amber', function () {
            this.player1.play(this.baitAndSwitch);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });

        it('should steal additional amber while opponent has more', function () {
            this.player1.amber = 1;
            this.player2.amber = 4;
            this.player1.play(this.baitAndSwitch);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
        });

        it('should steal additional amber while opponent has more', function () {
            this.player1.amber = 0;
            this.player2.amber = 7;
            this.player1.play(this.baitAndSwitch);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
        });
    });
});
