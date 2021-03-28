describe('Blood Money', function () {
    describe("Blood Money's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['blood-money']
                },
                player2: {
                    inPlay: ['zorg']
                }
            });
        });

        it('should place 2 amber on a creature', function () {
            this.player1.play(this.bloodMoney);
            expect(this.player1).toHavePrompt('Blood Money');
            this.player1.clickCard(this.zorg);
            expect(this.zorg.tokens.amber).toBe(2);
        });
    });
});
