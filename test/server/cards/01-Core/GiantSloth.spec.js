describe('Giant Sloth', function () {
    describe("Giant Sloth's ability after discarding Untamed card", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['giant-sloth'],
                    hand: ['dust-pixie']
                },
                player2: {}
            });
        });

        it('should be able to use after discarding an Untamed card', function () {
            this.player1.clickCard(this.giantSloth);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.dustPixie);
            this.player1.clickPrompt('Discard this card');
            this.player1.clickCard(this.giantSloth);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).not.isReadyToTakeAction();
            this.player1.useAction(this.giantSloth);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
