describe('Steward of Law', function() {
    integration(function() {
        describe('Steward of Law/Spies at court interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law'],
                        hand: ['spies-at-court', 'court-games']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'earth',
                    attackers: ['steward-of-law'],
                    defenders: []
                });
            });

            it('shouldn\'t allow characters to become dishonored to pay the cost of Spies', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Earth Ring');
            });

            it('should allow honored characters to trigger Spies', function() {
                this.player2.pass();
                this.player1.clickCard('court-games');
                this.player1.clickPrompt('Honor a friendly character');
                this.stewardOfLaw = this.player1.clickCard('steward-of-law');
                expect(this.stewardOfLaw.isHonored).toBe(true);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('spies-at-court');
            });
        });
    });
});
