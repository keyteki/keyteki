describe('Ancestral Lands', function() {
    integration(function() {
        describe('Ancestral Lands\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni']
                    },
                    player2: {
                        provinces: ['ancestral-lands']
                    }
                });
                this.ancestralLands = this.player2.findCardByName('ancestral-lands', 'province 1');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
                this.noMoreActions();
            });

            it('should not be active outside of a conflict', function() {
                expect(this.ancestralLands.getStrength()).toBe(5);
            });

            it('should be active during a political conflict at another province', function() {
                this.ancestralLands.facedown = false;
                this.initiateConflict({
                    type: 'political',
                    province: this.shamefulDisplay,
                    attackers: ['togashi-yokuni'],
                    defenders: []
                });
                expect(this.ancestralLands.getStrength()).toBe(10);
            });

            it('should not be active during a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    province: this.ancestralLands,
                    attackers: ['togashi-yokuni'],
                    defenders: []
                });
                expect(this.ancestralLands.getStrength()).toBe(5);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Break Ancestral Lands');
            });

            it('should be active during a political conflict', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'political',
                    province: this.ancestralLands,
                    attackers: ['togashi-yokuni'],
                    defenders: []
                });
                expect(this.ancestralLands.getStrength()).toBe(10);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Air Ring');
            });
        });
    });
});
