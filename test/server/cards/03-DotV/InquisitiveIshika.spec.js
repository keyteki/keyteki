describe('Inquisitive Ishika', function() {
    integration(function() {
        describe('Inquisitive Ishika\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: ['seppun-guardsman'],
                        hand: ['against-the-waves']
                    },
                    player2: {
                        inPlay: ['inquisitive-ishika']
                    }
                });
                this.againstTheWaves = this.player1.findCardByName('against-the-waves');
                this.inquisitiveIshika = this.player2.findCardByName('inquisitive-ishika');
            });

            it('should make the player pay costs normally before a conflict starts', function() {
                expect(this.inquisitiveIshika.bowed).toBe(false);
                this.player1.clickCard(this.againstTheWaves);
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.inquisitiveIshika);
                expect(this.player1.player.fate).toBe(4);
                expect(this.inquisitiveIshika.bowed).toBe(true);
            });

            it('should reduce the cost of events which match the trait during conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    attackers: ['seppun-guardsman'],
                    defenders: []
                });
                expect(this.game.rings.water.contested).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.inquisitiveIshika);
                expect(this.player1.player.fate).toBe(5);
                expect(this.inquisitiveIshika.bowed).toBe(true);
            });

            it('should not give any reductions once the conflict is finished', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    attackers: ['seppun-guardsman'],
                    defenders: []
                });
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.rings.water.contested).toBe(false);
                expect(this.game.rings.water.claimed).toBe(true);
                this.player1.clickCard(this.againstTheWaves);
                this.player1.clickCard(this.inquisitiveIshika);
                expect(this.player1.player.fate).toBe(4);
                expect(this.inquisitiveIshika.bowed).toBe(true);
            });
        });
    });
});
