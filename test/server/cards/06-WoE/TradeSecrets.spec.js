describe('Trade Secrets', function () {
    describe('Trade Secrets', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'ekwidon',
                    hand: ['trade-secrets', 'antiquities-dealer', 'outnegotiate', 'pelf']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('should steal nothing if you discard nothing', function () {
            this.player1.play(this.tradeSecrets);
            expect(this.player1).toBeAbleToSelect(this.antiquitiesDealer);
            expect(this.player1).toBeAbleToSelect(this.outnegotiate);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(6);
        });

        it('should steal 1 if you discard 1', function () {
            this.player1.play(this.tradeSecrets);
            this.player1.clickCard(this.outnegotiate);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
        });

        it('should steal 2 if you discard 2', function () {
            this.player1.play(this.tradeSecrets);
            this.player1.clickCard(this.antiquitiesDealer);
            this.player1.clickCard(this.outnegotiate);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
        });
    });
});
