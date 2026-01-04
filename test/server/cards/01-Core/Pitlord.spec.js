describe('Pitlord', function () {
    describe("Pitlord's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['pitlord']
                },
                player2: {}
            });
        });

        it('should restrict house choice to Dis', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).not.toHavePromptButton('untamed');
            expect(this.player1).not.toHavePromptButton('sanctum');
            expect(this.player1.currentPrompt().buttons.length).toBe(1);
            this.player1.clickPrompt('dis');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
