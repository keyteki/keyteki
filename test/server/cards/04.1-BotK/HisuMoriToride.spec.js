describe('Hisu Mori Toride', function() {
    integration(function() {
        describe('Hisu Mori Toride\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'hisu-mori-toride',
                        inPlay: ['matsu-berserker', 'matsu-seventh-legion'],
                        hand: ['fine-katana']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
                this.player2.pass();
            });

            it('should not trigger except when winning by 5 or more', function() {
                this.player1.pass();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                this.player1.clickPrompt('No');
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('should bow the stronghold and sacrifice a bushi when triggered', function() {
                this.player1.playAttachment('fine-katana', 'matsu-berserker');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.hisuMoriToride = this.player1.clickCard('hisu-mori-toride');
                expect(this.player1).toHavePrompt('Hisu Mori Toride');
                expect(this.player1).toBeAbleToSelect('matsu-berserker');
                expect(this.player1).toBeAbleToSelect('matsu-seventh-legion');
                this.matsuBerserker = this.player1.clickCard('matsu-berserker');
                expect(this.player1.player.getConflictOpportunities()).toBe(2);
                expect(this.player1.player.getConflictOpportunities('military')).toBe(1);
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.hisuMoriToride.bowed).toBe(true);
            });

            it('should give the triggering player an additional military conflict', function() {
                this.player1.playAttachment('fine-katana', 'matsu-berserker');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard('hisu-mori-toride');
                this.matsuBerserker = this.player1.clickCard('matsu-berserker');
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
                    attackers: ['matsu-seventh-legion'],
                    defenders: []
                });
                expect(this.game.currentConflict.conflictType).toBe('military');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
