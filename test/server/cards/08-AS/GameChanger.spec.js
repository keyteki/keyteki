describe('Game Changer', function () {
    describe("Game Changer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['game-changer', 'ancient-bear', 'the-old-tinker']
                },
                player2: {
                    amber: 4,
                    inPlay: ['iron-heidy']
                }
            });
        });

        it('should prevent friendly Ekwidon creatures from reaping', function () {
            this.player1.clickCard(this.gameChanger);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.clickCard(this.theOldTinker);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.endTurn();

            this.player2.clickPrompt('ekwidon');
            this.player2.reap(this.ironHeidy);
            expect(this.player2.amber).toBe(5);
            this.player2.endTurn();

            this.player1.clickPrompt('untamed');
            this.player1.reap(this.ancientBear);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give friendly Ekwidon creatures a steal ability', function () {
            this.player1.useAction(this.gameChanger);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);

            this.player1.useAction(this.theOldTinker);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();

            this.player2.clickPrompt('ekwidon');
            this.player2.clickCard(this.ironHeidy);
            expect(this.player2).not.toHavePromptButton("Use this card's Action ability");
            this.player2.clickPrompt('Cancel');
            this.player2.endTurn();

            this.player1.clickPrompt('untamed');
            this.player1.clickCard(this.ancientBear);
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            this.player1.clickPrompt('Cancel');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
