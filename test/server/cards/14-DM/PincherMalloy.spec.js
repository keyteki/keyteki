describe('Pincher Malloy', function () {
    describe("Pincher Malloy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['pincher-malloy', 'pincher-malloy']
                },
                player2: {}
            });
            this.pincher1 = this.player1.hand[0];
            this.pincher2 = this.player1.hand[1];
        });

        it('steals 2 when opponent has more amber', function () {
            this.player1.amber = 0;
            this.player2.amber = 5;
            this.player1.play(this.pincher1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if opponent does not have more amber', function () {
            this.player1.amber = 3;
            this.player2.amber = 3;
            this.player1.play(this.pincher1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
