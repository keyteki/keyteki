describe('Hallowed Shield', function () {
    describe("Hallowed Shield's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['hallowed-shield', 'tunk']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should prevent a creature from being dealt damage for the turn', function () {
            this.player1.useAction(this.hallowedShield);

            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.tunk);

            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.fightWith(this.lamindra, this.tunk);

            expect(this.tunk.tokens.damage).toBeUndefined();
            expect(this.lamindra.tokens.damage).toBe(7);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
