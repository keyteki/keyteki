describe("Minerva's Wings", function () {
    describe("Minerva's Wing's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'logos',
                    hand: ['minerva-s-wings'],
                    inPlay: ['helper-bot']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should prevent fights and reaps on friendly creature, while giving a draw 2 action', function () {
            this.player1.playUpgrade(this.minervaSWings, this.helperBot);
            this.player1.clickCard(this.helperBot);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).not.toHavePromptButton('Fight with this creature');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should prevent fights and reaps on enemy creature, while giving a draw 2 action', function () {
            this.player1.playUpgrade(this.minervaSWings, this.dustPixie);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.clickCard(this.dustPixie);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
            this.player2.clickPrompt("Use this card's Action ability");
            expect(this.player2.player.hand.length).toBe(2);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
