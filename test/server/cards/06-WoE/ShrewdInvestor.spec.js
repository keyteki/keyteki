describe('Shrewd Investor', function () {
    describe("Shrewd Investor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['shrewd-investor']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should do nothing if the player chooses done', function () {
            this.player1.playCreature(this.shrewdInvestor);
            expect(this.player1).toBeAbleToSelect(this.shrewdInvestor);
            this.player1.clickPrompt('Done');
            expect(this.player2.amber).toBe(3);
            expect(this.shrewdInvestor.amber).toBe(0);
        });

        it('should capture if the player chooses to have opponent gain 1', function () {
            this.player1.playCreature(this.shrewdInvestor);
            this.player1.clickCard(this.shrewdInvestor);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.shrewdInvestor.amber).toBe(4);
        });
    });
});
