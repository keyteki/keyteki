describe('Ide Trader', function() {
    integration(function() {
        describe('Ide Trader ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 8,
                        inPlay: ['ide-trader', 'shinjo-outrider', 'iuchi-wayfinder'],
                        hand: ['favored-mount', 'spyglass'],
                        dynastyDeck: ['favorable-ground']
                    },
                    player2: {
                        inPlay: ['shinjo-outrider']
                    }
                });
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground', 'province 1');
                this.ideTrader = this.player1.findCardByName('ide-trader');
                this.favoredMount = this.player1.playAttachment('favored-mount', this.ideTrader);
                this.noMoreActions();
            });

            it('should trigger when another character joins the conflict', function() {
                this.initiateConflict({
                    attackers: [this.ideTrader],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('shinjo-outrider');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
            });

            it('should give the player the choice between fate or a card', function() {
                this.initiateConflict({
                    attackers: [this.ideTrader],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('shinjo-outrider');
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Ide Trader');
                expect(this.player1.currentButtons).toContain('Gain 1 fate');
                expect(this.player1.currentButtons).toContain('Draw 1 card');
                this.player1.clickPrompt('Gain 1 fate');
                expect(this.player1.fate).toBe(8);
            });

            it('should draw a card when the player chooses that option', function() {
                this.initiateConflict({
                    attackers: [this.ideTrader],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('shinjo-outrider');
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Ide Trader');
                expect(this.player1.currentButtons).toContain('Gain 1 fate');
                expect(this.player1.currentButtons).toContain('Draw 1 card');
                this.player1.clickPrompt('Draw 1 card');
                expect(this.player1.player.hand.size()).toBe(2);
            });

            it('should trigger when an opposing character joins the conflict', function() {
                this.initiateConflict({
                    attackers: [this.ideTrader],
                    defenders: []
                });
                this.player2.clickCard('shinjo-outrider');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
            });

            it('should trigger when ide trader joins a conflict', function() {
                this.initiateConflict({
                    attackers: ['iuchi-wayfinder'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
            });

            it('should trigger in the same window as spyglass', function() {
                this.initiateConflict({
                    attackers: ['iuchi-wayfinder'],
                    defenders: []
                });
                this.player2.pass();
                this.spyglass = this.player1.playAttachment('spyglass', this.ideTrader);
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                this.player1.clickCard(this.ideTrader);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ideTrader);
                expect(this.player1).toBeAbleToSelect(this.spyglass);
            });
        });
    });
});
