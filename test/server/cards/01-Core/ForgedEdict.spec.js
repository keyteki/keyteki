describe('Forged Edict', function() {
    integration(function() {
        describe('Double cancels', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['young-rumormonger', 'young-rumormonger'],
                        hand: ['forged-edict', 'forged-edict']
                    },
                    player2: {
                        hand: ['assassination']
                    }
                });
                [this.youngRumormonger1, this.youngRumormonger2] = this.player1.player.cardsInPlay.toArray();
                [this.forgedEdict1, this.forgedEdict2] = this.player1.player.hand.toArray();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['young-rumormonger'],
                    defenders: []
                });
                this.player2.clickCard('assassination');
                this.player2.clickCard(this.youngRumormonger1);
            });

            it('should allow Assassination to be cancelled', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.forgedEdict1);
            });

            it('should cancel Assassination when Forged Edict is played, and not prompt for a second cancel', function() {
                this.window = this.game.currentAbilityWindow;
                this.event = this.window.events.find(event => event.name === 'onCardAbilityInitiated');
                this.player1.clickCard(this.forgedEdict1);
                this.player1.clickCard(this.youngRumormonger1);
                this.player1.clickPrompt('Pass');
                expect(this.window.events).not.toContain(this.event);
                expect(this.event.cancelled).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should permit a cancel if the honor is moved to another YR', function() {
                this.player1.clickCard(this.forgedEdict1);
                this.player1.clickCard(this.youngRumormonger1);
                this.player1.clickCard(this.youngRumormonger1);
                this.player1.clickCard(this.youngRumormonger2);
                this.player1.clickPrompt('Pass');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should permit a cancel if the honor is moved twice', function() {
                this.player1.clickCard(this.forgedEdict1);
                this.player1.clickCard(this.youngRumormonger1);
                this.player1.clickCard(this.youngRumormonger1);
                this.player1.clickCard(this.youngRumormonger2);
                this.player1.clickCard(this.youngRumormonger2);
                this.player1.clickCard(this.youngRumormonger1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
