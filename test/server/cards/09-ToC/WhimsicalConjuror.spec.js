describe('Whimsical Conjuror', function () {
    describe("Whimsical Conjuror's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'niffle-brute',
                    inPlay: ['whimsical-conjuror'],
                    hand: ['dust-pixie']
                },
                player2: {
                    amber: 2
                }
            });

            this.niffleBrute1 = this.player1.player.deck[0];
            this.niffleBrute2 = this.player1.player.deck[1];
        });

        it('should allow making a token creature instead of resolving amber', function () {
            this.player1.play(this.dustPixie);
            expect(this.player1).toHavePrompt('How do you wish to resolve this amber icon?');
            expect(this.player1).toHavePromptButton('amber');
            expect(this.player1).toHavePromptButton('token');
            this.player1.clickPrompt('token');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('token');
            this.player1.clickPrompt('Right');
            expect(this.niffleBrute1.location).toBe('play area');
            expect(this.niffleBrute2.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow resolving amber', function () {
            this.player1.play(this.dustPixie);
            this.player1.clickPrompt('amber');
            this.player1.clickPrompt('amber');
            expect(this.niffleBrute1.location).toBe('deck');
            expect(this.niffleBrute2.location).toBe('deck');
            expect(this.player1.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
