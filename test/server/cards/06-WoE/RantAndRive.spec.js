describe('Rant and Rive', function () {
    describe("Rant and Rive's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 10,
                    hand: ['rant-and-rive']
                },
                player2: {
                    amber: 7
                }
            });
        });

        it('should not affect amber less than 8', function () {
            this.player1.play(this.rantAndRive);
            expect(this.player1.amber).toBe(11);
            expect(this.player2.amber).toBe(7);
        });

        it('should halve opponent amber', function () {
            this.player2.amber = 8;
            this.player1.play(this.rantAndRive);
            expect(this.player1.amber).toBe(11);
            expect(this.player2.amber).toBe(4);
        });

        it('should round down the loss', function () {
            this.player2.amber = 11;
            this.player1.play(this.rantAndRive);
            expect(this.player1.amber).toBe(11);
            expect(this.player2.amber).toBe(6);
        });
    });
});
