describe('Routine Job', function () {
    describe("Routine Job's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['routine-job', 'routine-job']
                },
                player2: {
                    amber: 4,
                    inPlay: []
                }
            });
        });

        it('should steal 1 amber when there are no copies in the discard pile', function () {
            this.player1.play(this.player1.hand[0]);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should steal 2 amber when there is a copy in the discard pile', function () {
            this.player1.play(this.player1.hand[0]);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            this.player1.play(this.player1.hand[0]);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
        });
    });
});
