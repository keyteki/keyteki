describe('Pismire', function () {
    describe("Pismire's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    inPlay: ['pismire', 'flaxia', 'bumblebird'],
                    hand: ['fandangle']
                },
                player2: {
                    amber: 8,
                    inPlay: ['bull-wark', 'bulwark']
                }
            });
        });

        it("should not increase opponent's amber if friendly Mutant creatures' count is not greater", function () {
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.amber).toBe(2);
        });

        it("should increase opponent's amber if friendly Mutant creatures' count is greater", function () {
            this.player1.play(this.fandangle);
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.amber).toBe(0);
        });
    });
});
