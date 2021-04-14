describe('Fuguru', function () {
    describe("Fuguru's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['stealer-of-souls', 'screaming-cave']
                },
                player2: {
                    inPlay: ['fuguru', 'fuguru']
                }
            });
        });

        it("should reduce opponent's hand during draw phase and stack", function () {
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(4);
        });
    });
});
