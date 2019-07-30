describe('Smite', function() {
    integration(function() {
        describe('Smite\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        hand: ['smite'],
                        inPlay: ['sequis']
                    },
                    player2: {
                        inPlay: ['murmook', 'mighty-tiger', 'troll']
                    }
                });
            });

            it('should cause a creature to fight, and then deal 2 damage to its neighbors', function() {
                this.player1.play(this.smite);
                expect(this.player1).toHavePrompt('Smite');
                this.player1.clickCard(this.sequis);
                expect(this.player1).toHavePrompt('Sequis');
                expect(this.player1).toBeAbleToSelect(this.mightyTiger);
                this.player1.clickCard(this.mightyTiger);
                expect(this.mightyTiger.location).toBe('discard');
                expect(this.murmook.tokens.damage).toBe(2);
                expect(this.troll.tokens.damage).toBe(2);
            });
        });
    });
});
