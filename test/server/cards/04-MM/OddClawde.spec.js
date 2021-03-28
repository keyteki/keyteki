describe('OddClawde', function () {
    describe("Odd Clawde's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['fandangle', 'odd-clawde'],
                    hand: ['hunting-witch', 'dextre']
                },
                player2: {
                    amber: 1,
                    hand: ['remote-access']
                }
            });
        });

        it("steal an amber if the opponent's amber is odd", function () {
            this.player1.useAction(this.oddClawde);

            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(2);
        });

        it("should not steal an amber if the opponent's amber is even", function () {
            this.player2.player.amber = 2;

            this.player1.useAction(this.oddClawde);

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });
    });
});
