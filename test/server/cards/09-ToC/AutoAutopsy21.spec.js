describe('Auto-Autopsy 2.1', function () {
    describe("Auto Autopsy 2.1's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    token: 'alpha-gamma',
                    hand: ['auto-autopsy-21'],
                    inPlay: ['flaxia', 'helper-bot'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });

            this.alphaGamma1 = this.player1.player.deck[0];
            this.player1.chains = 36;
        });

        it('should make a token creature on play', function () {
            this.player1.play(this.autoAutopsy21);
            this.player1.clickPrompt('Left');
            expect(this.alphaGamma1.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should destroy a friendly creature and gain amber on omni', function () {
            this.player1.play(this.autoAutopsy21);
            this.player1.clickPrompt('Left');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.useAction(this.autoAutopsy21, true);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.alphaGamma1);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.helperBot);
            expect(this.player1.amber).toBe(3);
            expect(this.helperBot.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
