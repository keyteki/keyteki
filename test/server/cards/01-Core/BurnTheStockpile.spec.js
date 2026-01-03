describe('Burn The Stockpile', function () {
    describe("Burn The Stockpile's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['burn-the-stockpile']
                },
                player2: {}
            });
        });

        it('should make opponent lose 4 amber if they have 7 or more', function () {
            this.player2.amber = 8;
            this.player1.play(this.burnTheStockpile);
            expect(this.player2.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not make opponent lose amber if they have less than 7', function () {
            this.player2.amber = 6;
            this.player1.play(this.burnTheStockpile);
            expect(this.player2.amber).toBe(6);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
