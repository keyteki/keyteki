describe('Isawa Tadaka', function() {
    integration(function() {
        describe('Isawa Tadaka\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['seppun-guardsman'],
                        hand: ['against-the-waves', 'against-the-waves']
                    },
                    player2: {
                        inPlay: ['isawa-tadaka']
                    }
                });
                this.isawaTadaka = this.player2.findCardByName('isawa-tadaka');
                this.player1.clickCard('against-the-waves');
                this.player1.clickCard(this.isawaTadaka);
                this.againstTheWaves = this.player1.findCardByName('against-the-waves', 'hand');
                this.player2.pass();
            });

            it('should stop a player from playing an event in their discard pile', function() {
                expect(this.isawaTadaka.bowed).toBe(true);
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should stop a player from playing an event in their discard pile while the earth ring is contested', function() {
                this.player1.pass();
                this.initiateConflict({
                    type: 'military',
                    ring: 'earth',
                    attackers: ['seppun-guardsman'],
                    defenders: []
                });
                expect(this.game.rings.earth.contested).toBe(true);
                expect(this.game.rings.earth.claimed).toBe(false);
                this.player2.pass();
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should allow a player to play an event in their discard pile if they have claimed the earth ring', function() {
                this.player1.pass();
                this.initiateConflict({
                    type: 'military',
                    ring: 'earth',
                    attackers: ['seppun-guardsman'],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.rings.earth.contested).toBe(false);
                expect(this.game.rings.earth.claimed).toBe(true);
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Against the Waves');
            });
        });
    });
});
