describe('Hisu Mori Toride', function() {
    integration(function() {
        describe('Hisu Mori Toride\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'hisu-mori-toride-elements-unbound',
                        inPlay: ['aggressive-moto', 'border-rider', 'ide-trader']
                    },
                    player2: {
                        inPlay: ['hida-guardian']
                    }
                });

                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.ideTrader = this.player1.findCardByName('ide-trader');

                this.hidaGuardian = this.player2.findCardByName('hida-guardian');

                this.noMoreActions();
            });


            it('should not trigger when winning a conflict with the same of less participants', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.aggressiveMoto],
                    defenders: [this.hidaGuardian]
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Don\'t resolve');
            });

            it('should bow the stronghold and sacrifice a cavalry when triggered', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.aggressiveMoto, this.ideTrader],
                    defenders: [this.hidaGuardian]
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.hisuMoriToride = this.player1.clickCard('hisu-mori-toride-elements-unbound');
                expect(this.player1).toHavePrompt('Select card to sacrifice');
                expect(this.player1).toBeAbleToSelect(this.aggressiveMoto);
                expect(this.player1).toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.ideTrader);
                this.player1.clickCard(this.borderRider);
                expect(this.player1.player.getConflictOpportunities()).toBe(2);
                expect(this.player1.player.getConflictOpportunities('military')).toBe(1);
                expect(this.borderRider.location).toBe('dynasty discard pile');
                expect(this.hisuMoriToride.bowed).toBe(true);
            });

            it('should give the triggering player an additional military conflict', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: [this.aggressiveMoto, this.ideTrader],
                    defenders: [this.hidaGuardian]
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard('hisu-mori-toride-elements-unbound');
                expect(this.player1).toHavePrompt('Select card to sacrifice');
                this.player1.clickCard(this.aggressiveMoto);
                expect(this.player1.player.getConflictOpportunities()).toBe(2);
                expect(this.player1.player.getConflictOpportunities('military')).toBe(1);
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Gain 2 Honor');
                this.noMoreActions();
                this.noMoreActions();
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
                this.initiateConflict({
                    ring: 'earth',
                    type: 'military',
                    province: this.shamefulDisplay,
                    attackers: [this.borderRider],
                    defenders: []
                });
                expect(this.game.currentConflict.conflictType).toBe('military');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
