describe('Shooler', function () {
    describe("Shooler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['shooler']
                },
                player2: {}
            });
        });

        it('should steal 1A when opponent has 4', function () {
            this.player2.amber = 4;
            this.player1.play(this.shooler);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal 1A when opponent has more than 4 amber', function () {
            this.player2.amber = 6;
            this.player1.play(this.shooler);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal when opponent has less than 4 amber', function () {
            this.player2.amber = 3;
            this.player1.play(this.shooler);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
