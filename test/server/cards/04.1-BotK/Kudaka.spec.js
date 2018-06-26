describe('Kudaka', function() {
    integration(function() {
        describe('Kudaka\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 0,
                        inPlay:['kudaka'],
                        hand: ['seeker-of-knowledge'],
                        conflictDeck: ['fine-katana', 'watch-commander', 'favored-mount']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['kudaka'],
                    defenders: []
                });
                this.player2.pass(); //Pass priority to player 1
                this.kudaka = this.player1.findCardByName('Kudaka', 'play area');
                this.player1.pass();
                // Discard card in province
                this.player1.clickPrompt('Yes');
                // Gain honor from air ring claim
                this.player1.clickPrompt('Gain 2 Honor');
            });

            it('should prompt the player for reactions', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
            });

            describe('when the player activates the reaction', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.kudaka);
                });

                it('should gain 1 fate', function() {
                    expect(this.player1.fate).toBe(1);
                });

                it('should draw 1 card', function() {
                    expect(this.player1.hand.length).toBe(2);
                });
            });
        });
    });
});
