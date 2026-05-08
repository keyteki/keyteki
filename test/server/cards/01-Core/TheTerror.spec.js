describe('The Terror', function () {
    describe("The Terror's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['the-terror']
                },
                player2: {
                    amber: 0
                }
            });
        });

        it('should gain 2 amber when opponent has no amber', function () {
            this.player1.play(this.theTerror);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber when opponent has amber', function () {
            this.player2.amber = 1;
            this.player1.play(this.theTerror);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
