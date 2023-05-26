describe('Trader', function () {
    describe("Trader's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'trader',
                    amber: 1,
                    inPlay: ['trader', 'sandhopper']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'krump']
                }
            });

            this.versusCard = this.trader.versusCard;
        });

        it('should steal 1A and destroy himself', function () {
            this.player1.useAction(this.trader);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.versusCard.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should be destroyed if opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.useAction(this.trader);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.versusCard.location).toBe('discard');
            this.player1.endTurn();
        });
    });
});
