describe('Word of Returning', function() {
    integration(function() {
        describe('Word of Returning\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['silvertooth'],
                        hand: ['word-of-returning']
                    },
                    player2: {
                        inPlay: ['dextre', 'sequis', 'mother']
                    }
                });
                this.silvertooth.addToken('amber');
                this.dextre.addToken('amber');
                this.sequis.addToken('amber', 4);
            });

            it('should deal a damage to each enemy unit for each amber they have, and take all amber', function() {
                this.player1.play(this.wordOfReturning);
                expect(this.dextre.tokens.damage).toBe(1);
                expect(this.mother.hasToken('damage')).toBe(false);
                expect(this.sequis.tokens.damage).toBe(2);
                expect(this.dextre.hasToken('amber')).toBe(false);
                expect(this.sequis.hasToken('amber')).toBe(false);
                expect(this.player1.amber).toBe(6);
            });
        });
    });
});
