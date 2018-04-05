describe('Kyuden Isawa', function() {
    integration(function() {
        describe('Kyuden Isawa\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'kyuden-isawa',
                        inPlay: ['adept-of-the-waves'],
                        hand: ['against-the-waves']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.player2.pass();
            });

            it('should let you play a spell from the discard pile', function() {
                this.againstTheWaves = this.player1.clickCard('against-the-waves');
                this.adeptOfTheWaves = this.player1.clickCard('adept-of-the-waves');
                expect(this.adeptOfTheWaves.bowed).toBe(true);
                this.player2.pass();
                this.kyudenIsawa = this.player1.clickCard('kyuden-isawa');
                expect(this.player1).toHavePrompt('Choose a spell event');
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.adeptOfTheWaves.bowed).toBe(false);
                expect(this.againstTheWaves.location).toBe('removed from game');
            });
        });
    });
});
