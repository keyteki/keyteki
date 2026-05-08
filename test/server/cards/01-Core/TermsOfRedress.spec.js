describe('Terms of Redress', function () {
    describe("Terms of Redress' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['terms-of-redress'],
                    inPlay: ['staunch-knight']
                },
                player2: {
                    amber: 3,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should capture 2A on a friendly creature', function () {
            this.player1.play(this.termsOfRedress);
            expect(this.player1).toHavePrompt('Terms of Redress');
            expect(this.player1).toBeAbleToSelect(this.staunchKnight);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.staunchKnight);
            expect(this.staunchKnight.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should capture only available amber if opponent has less than 2', function () {
            this.player2.amber = 1;
            this.player1.play(this.termsOfRedress);
            this.player1.clickCard(this.staunchKnight);
            expect(this.staunchKnight.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
