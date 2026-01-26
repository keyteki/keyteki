describe('Icarus 2.0', function () {
    describe("Icarus 2.0's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['icarus-20', 'helper-bot']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });

            this.player1.makeMaverick(this.icarus20, 'logos');
        });

        it('should give friendly creatures an action to draw a card', function () {
            this.player1.useAction(this.helperBot);
            expect(this.player1.player.hand.length).toBe(1);
            this.player1.useAction(this.icarus20);
            expect(this.player1.player.hand.length).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.troll);
            expect(this.player2).not.toHavePrompt("Use this card's Action ability");
        });
    });
});
