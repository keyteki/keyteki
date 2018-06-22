describe('Rally to the Cause', function() {
    integration(function() {
        describe('Rally to the Cause\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker']
                    },
                    player2: {
                        provinces: ['rally-to-the-cause']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker']
                });
            });

            it('should trigger when attackers are declared', function() {
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('rally-to-the-cause');
            });

            it('should change the conflict type and send illegal attackers home bowed', function() {
                this.player2.clickCard('rally-to-the-cause');
                expect(this.game.currentConflict.conflictType).toBe('political');
                expect(this.matsuBerserker.bowed).toBe(true);
                expect(this.matsuBerserker.inConflict).toBe(false);
            });
        });
    });
});
