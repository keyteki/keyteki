describe('Chaos Portal', function () {
    describe("Chaos Portal's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['chaos-portal'],
                    discard: ['duskwitch', 'bad-penny']
                }
            });
        });

        it('should prompt to choose a house', function () {
            this.player1.useAction(this.chaosPortal);
            expect(this.player1).toHavePrompt('Chaos Portal');
            expect(this.player1).toHavePromptButton('brobnar');
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('logos');
            expect(this.player1).toHavePromptButton('mars');
            expect(this.player1).toHavePromptButton('sanctum');
            expect(this.player1).toHavePromptButton('shadows');
            expect(this.player1).toHavePromptButton('untamed');
            expect(this.player1).toHavePromptButton('staralliance');
            expect(this.player1).toHavePromptButton('saurian');
        });

        it('should play the card if it is of the chosen house', function () {
            this.player1.moveCard(this.badPenny, 'deck');
            expect(this.badPenny.location).toBe('deck');
            this.player1.useAction(this.chaosPortal);
            this.player1.clickPrompt('shadows');
            expect(this.badPenny.location).toBe('play area');
        });

        it('should not play the card if it is of a different house', function () {
            this.player1.moveCard(this.badPenny, 'deck');
            expect(this.badPenny.location).toBe('deck');
            this.player1.useAction(this.chaosPortal);
            this.player1.clickPrompt('untamed');
            expect(this.badPenny.location).toBe('deck');
        });

        it('should end the turn when an omega card is played', function () {
            this.player1.moveCard(this.duskwitch, 'deck');
            expect(this.duskwitch.location).toBe('deck');
            this.player1.useAction(this.chaosPortal);
            this.player1.clickPrompt('untamed');
            expect(this.duskwitch.location).toBe('play area');
            expect(this.player2).toHavePrompt('House Choice');
        });
    });
});
