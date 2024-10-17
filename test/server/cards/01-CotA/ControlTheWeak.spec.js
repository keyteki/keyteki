describe('Control the Weak', function () {
    describe("Control the Weak's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['control-the-weak', 'hand-of-dis']
                },
                player2: {
                    inPlay: ['doc-bookton', 'pitlord', 'troll']
                }
            });
        });

        it('should force the opponent to pick a particular house', function () {
            this.player1.play(this.handOfDis);
            this.player1.clickCard(this.pitlord);
            expect(this.pitlord.location).toBe('discard');
            this.player1.play(this.controlTheWeak);
            expect(this.player1).toHavePrompt('Control the Weak');
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('logos');
            expect(this.player1).toHavePromptButton('brobnar');
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('House Choice');
            expect(this.player2).not.toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('logos');
            expect(this.player2).not.toHavePromptButton('brobnar');
        });

        it('should interact correctly with Pitlord', function () {
            this.player1.play(this.controlTheWeak);
            expect(this.player1).toHavePrompt('Control the Weak');
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('logos');
            expect(this.player1).toHavePromptButton('brobnar');
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            expect(this.player2).toHavePrompt('House Choice');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('logos');
            expect(this.player2).not.toHavePromptButton('brobnar');
        });
    });
});
