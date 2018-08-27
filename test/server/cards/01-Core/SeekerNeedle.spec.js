describe('Seeker Needle', function() {
    integration(function() {
        describe('Seeker Needle\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        inPlay: ['seeker-needle', 'silvertooth']
                    },
                    player2: {
                        inPlay: ['urchin']
                    }
                });
                this.player1.clickCard(this.seekerNeedle);
                this.player1.clickPrompt('Use this card\'s Action ability');
            });

            it('should deal a damage and gain an amber if it destroys the creature', function() {
                expect(this.player1).toHavePrompt('Seeker Needle');
                expect(this.player1).toBeAbleToSelect(this.urchin);
                expect(this.player1).toBeAbleToSelect(this.silvertooth);
                this.player1.clickCard(this.urchin);
                expect(this.urchin.location).toBe('discard');
                expect(this.player1.amber).toBe(1);
            });

            it('should only deal a damage when it doesn\'t destroy a creature', function() {
                this.player1.clickCard(this.silvertooth);
                expect(this.silvertooth.tokens.damage).toBe(1);
                expect(this.player1.amber).toBe(0);
            });
        });
    });
});
