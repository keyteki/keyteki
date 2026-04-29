describe('Pincher Malloy', function () {
    describe("Pincher Malloy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['pincher-malloy']
                },
                player2: {}
            });
        });

        it('steals 2 when opponent has more amber', function () {
            this.player1.amber = 0;
            this.player2.amber = 5;
            this.player1.play(this.pincherMalloy);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if opponent does not have more amber', function () {
            this.player1.amber = 3;
            this.player2.amber = 3;
            this.player1.play(this.pincherMalloy);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not steal when a bonus amber on Pincher Malloy ties the totals', function () {
            this.pincherMalloy.enhancements = ['amber'];
            this.player1.amber = 4;
            this.player2.amber = 5;
            this.player1.play(this.pincherMalloy);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
