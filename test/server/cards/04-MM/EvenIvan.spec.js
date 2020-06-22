describe('EvenIvan', function () {
    describe("Even Ivan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    inPlay: ['fandangle', 'even-ivan'],
                    hand: ['hunting-witch', 'dextre']
                },
                player2: {
                    amber: 1,
                    hand: ['remote-access']
                }
            });
        });

        it("not steal an amber if the opponent's amber is odd", function () {
            this.player1.useAction(this.evenIvan);

            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
        });

        it("should steal an amber if the opponent's amber is even", function () {
            this.player2.player.amber = 2;

            this.player1.useAction(this.evenIvan);

            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
        });
    });
});
