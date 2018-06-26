describe('Demonstrating Excellence', function() {
    integration(function() {
        describe('Demonstrating Excellence\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-horde', 'moto-horde', 'moto-horde']
                    },
                    player2: {
                        provinces: ['demonstrating-excellence']
                    }
                });
                this.demonstratingExcellence = this.player2.findCardByName('demonstrating-excellence');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-horde', 'moto-horde', 'moto-horde'],
                    defenders: []
                });
            });

            it('should work properly', function() {
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('demonstrating-excellence');
                let fate = this.player2.fate;
                this.demonstratingExcellence = this.player2.clickCard('demonstrating-excellence');
                expect(this.player1).toHavePrompt('Break Demonstrating Excellence');
                expect(this.player2.fate).toBe(fate + 1);
                expect(this.demonstratingExcellence.isBroken).toBe(true);
            });
        });
    });
});
