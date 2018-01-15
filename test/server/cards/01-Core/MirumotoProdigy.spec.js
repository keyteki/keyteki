describe('Mirumoto Prodigy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['Mirumoto Prodigy', 'Adept of the Waves']
                },
                player2: {
                    inPlay: ['Adept of the Waves', 'Adept of the Waves']
                }
            });
            this.noMoreActions();
        });

        describe('When it is attacking alone', function() {
            it('should not let more than 1 card defend', function() {
                this.initiateConflict({
                    attackers: ['Mirumoto Prodigy'],
                    defenders: ['Adept of the Waves', 'Adept of the Waves']
                });
                expect(this.game.currentConflict.defenders.length).toBe(1);
            });
        });

        describe('When it is not attacking alone', function() {
            it('should let more than 1 card defend', function() {
                this.initiateConflict({
                    attackers: ['Mirumoto Prodigy', 'Adept of the Waves'],
                    defenders: ['Adept of the Waves', 'Adept of the Waves']
                });
                expect(this.game.currentConflict.defenders.length).toBe(2);
            });
        });

    });
});
