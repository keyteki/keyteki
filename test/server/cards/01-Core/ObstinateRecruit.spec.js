describe('Obstinate Recruit', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    honor: 10,
                    dynastyDeck: ['obstinate-recruit'],
                    inPlay: ['matsu-berserker'],
                    hand: ['charge']
                },
                player2: {
                    honor: 11
                }
            });
            this.obstinateRecruit = this.player1.placeCardInProvince('obstinate-recruit', 'province 1');
        });

        describe('when controller has more honor', function() {
            it('should remain in play', function() {
                this.player1.player.honor = 12;
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('0');
                expect(this.obstinateRecruit.location).toBe('play area');
            });
        });

        describe('when the controller has less honor', function() {
            it('should be a legal action to play it and should go to the discard pile', function() {
                this.player1.clickCard(this.obstinateRecruit);
                this.player1.clickPrompt('0');
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
            });
        });

        describe('when playing Charge', function() {
            it('should be a legal action to play it and should go to the discard pile', function() {
                this.nextPhase();
                this.nextPhase();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('charge');
                expect(this.player1).toBeAbleToSelect(this.obstinateRecruit);
                this.player1.clickCard(this.obstinateRecruit);
                expect(this.obstinateRecruit.location).toBe('dynasty discard pile');
            });
        });
    });
});
