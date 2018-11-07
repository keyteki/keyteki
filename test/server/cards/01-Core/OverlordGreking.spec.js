describe('Overlord Greking', function() {
    integration(function() {
        describe('Overlord Greking\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['overlord-greking']
                    },
                    player2: {
                        inPlay: ['batdrone']
                    }
                });
            });

            it('should put a destroyed creature into play under the controller\'s control', function() {
                this.player1.fightWith(this.overlordGreking, this.batdrone);
                expect(this.overlordGreking.tokens.damage).toBe(2);
                expect(this.batdrone.hasToken('damage')).toBe(false);
                expect(this.batdrone.location).toBe('discard');
                expect(this.player1).toHavePrompt('Batdrone');
                this.player1.clickPrompt('Left');
                expect(this.batdrone.location).toBe('play area');
                expect(this.batdrone.controller).toBe(this.player1.player);
                expect(this.player1.player.cardsInPlay).toContain(this.batdrone);
            });
        });
    });
});
