describe('Border Fortress', function() {
    integration(function() {
        describe('Border Fortress\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        provinces: ['restoration-of-balance', 'night-raid'],
                        inPlay: ['matsu-berserker']
                    },
                    player2: {
                        provinces: ['border-fortress', 'rally-to-the-cause'],
                        hand: ['charge', 'banzai', 'court-games', 'i-am-ready', 'breakthrough']
                    }
                });
                this.restorationOfBalance = this.player1.findCardByName('restoration-of-balance');
                this.nightRaid = this.player1.findCardByName('night-raid');
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.borderFortress = this.player2.findCardByName('border-fortress');
                this.borderFortress.facedown = false;
                this.rallyToTheCause = this.player2.findCardByName('rally-to-the-cause');
                this.noMoreActions();
            });

            it('should not be usable when the conflict is not at this province', function() {
                this.rallyToTheCause.facedown = false;
                this.initiateConflict({
                    province: this.rallyToTheCause,
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
                this.player2.clickCard(this.borderFortress);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should be usable when the conflict is at this province', function() {
                this.initiateConflict({
                    province: this.borderFortress,
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
                this.player2.clickCard(this.borderFortress);
                expect(this.player2).toHavePrompt('Border Fortress');
            });

            it('should reveal the province chosen, and prompt for any on reveal triggers', function() {
                this.initiateConflict({
                    province: this.borderFortress,
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
                this.player2.clickCard(this.borderFortress);
                this.player2.clickCard(this.rallyToTheCause);
                expect(this.rallyToTheCause.facedown).toBe(false);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.rallyToTheCause);
            });

            it('should correctly trigger Rally to the Cause', function() {
                this.initiateConflict({
                    province: this.borderFortress,
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
                this.player2.clickCard(this.borderFortress);
                this.player2.clickCard(this.rallyToTheCause);
                this.player2.clickCard(this.rallyToTheCause);
                expect(this.matsuBerserker.bowed).toBe(true);
                expect(this.matsuBerserker.inConflict).toBe(false);
                expect(this.game.currentConflict.conflictType).toBe('political');
            });

            it('should correctly trigger an opponent\'s Restoration of Balance', function() {
                this.initiateConflict({
                    province: this.borderFortress,
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
                this.player2.clickCard(this.borderFortress);
                this.player2.clickCard(this.restorationOfBalance);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.restorationOfBalance);
                this.player1.clickCard(this.restorationOfBalance);
                expect(this.player2).toHavePrompt('Choose a card to discard');
            });

            it('should correctly trigger an opponent\'s Night Raid', function() {
                this.initiateConflict({
                    province: this.borderFortress,
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
                this.player2.clickCard(this.borderFortress);
                this.player2.clickCard(this.nightRaid);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.nightRaid);
                this.player1.clickCard(this.nightRaid);
                expect(this.player2).toHavePrompt('Choose a card to discard');
            });
        });
    });
});
