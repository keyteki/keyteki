describe('Marauding Oni', function() {
    integration(function() {
        describe('Marauding Oni\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['marauding-oni']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja']
                    }
                });
                this.noMoreActions();
            });

            it('should make its controller lose one honor when declared as an attacker', function() {
                this.initiateConflict({
                    attackers: ['marauding-oni']
                });
                expect(this.player1.honor).toBe(10);
            });

            it('should make its controller lose one honor when declared as an defender', function() {
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['doomed-shugenja'],
                    defenders: ['marauding-oni']
                });
                expect(this.player1.honor).toBe(10);
            });
        });
    });
});
