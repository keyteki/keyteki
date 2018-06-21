describe('Waning Hostilities', function() {
    integration(function() {
        describe('Waning Hostilities\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['seppun-guardsman'],
                        hand: ['waning-hostilities']
                    },
                    player2: {
                        inPlay: ['bayushi-liar']
                    }
                });
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
            });

            it('should trigger at the start of the conflict phase', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('waning-hostilities');
            });

            it('should reduce the conflict opportunities for both players to 1', function() {
                this.player1.clickCard('waning-hostilities');
                expect(this.player1.player.getConflictOpportunities()).toBe(1);
                expect(this.player2.player.getConflictOpportunities()).toBe(1);
            });
        });
    });
});
