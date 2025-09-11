describe('Anvil Crawler', function () {
    describe("Anvil Crawler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['anvil-crawler']
                },
                player2: {
                    inPlay: ['hunting-witch']
                }
            });
        });

        it('should let each player refill their hand to 7', function () {
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(7);
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player2.player.hand.length).toBe(7);
        });
    });
});
