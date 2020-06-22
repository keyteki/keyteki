describe('Martian Generosity', function () {
    describe("Martian Generosity's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 3,
                    hand: ['martian-generosity']
                },
                player2: {
                    inPlay: ['commander-remiel', 'bulwark', 'sequis']
                }
            });
        });

        it('should let a player draw 2 cards for each amber in pool', function () {
            this.player1.play(this.martianGenerosity);
            expect(this.player1.player.amber).toBe(0);
            expect(this.player1.hand.length).toBe(8);
            this.player1.endTurn();
        });
    });
});
