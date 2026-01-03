describe('Trading Frenzy', function () {
    describe("Trading Frenzy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'ekwidon',
                    hand: ['trading-frenzy'],
                    inPlay: ['pelf']
                },
                player2: {
                    amber: 3,
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should capture 3 on each side', function () {
            this.player1.play(this.tradingFrenzy);
            this.player1.clickCard(this.pelf);
            this.player1.clickCard(this.bumpsy);
            this.expectReadyToTakeAction(this.player1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.pelf.tokens.amber).toBe(3);
            expect(this.bumpsy.tokens.amber).toBe(3);
        });

        it('should not capture if no opponent creature', function () {
            this.bumpsy.location = 'discard';
            this.player1.play(this.tradingFrenzy);
            this.player1.clickCard(this.pelf);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(0);
            expect(this.pelf.tokens.amber).toBe(3);
        });

        it('should not capture if no opponent amber', function () {
            this.player2.amber = 0;
            this.player1.play(this.tradingFrenzy);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.bumpsy.tokens.amber).toBe(3);
        });
    });
});
