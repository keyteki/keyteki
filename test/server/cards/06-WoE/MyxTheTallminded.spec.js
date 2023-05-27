describe('Myx the Tallminded', function () {
    describe("Myx the Tallminded's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'mars',
                    inPlay: ['myx-the-tallminded', 'blypyp', 'pelf']
                },
                player2: {
                    amber: 10,
                    inPlay: ['john-smyth']
                }
            });
        });

        it("should increase the cost of opponent's keys by 1 for each friendly mars creature", function () {
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.player.amber).toBe(2);
            this.player2.clickPrompt('mars');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.player.amber).toBe(0);
        });
    });
});
