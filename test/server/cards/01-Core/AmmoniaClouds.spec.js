describe('Ammonia Clouds', function() {
    integration(function() {
        describe('when played', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'mars',
                        inPlay: ['ancient-bear', 'troll'],
                        hand: ['ammonia-clouds']
                    },
                    player2: {
                        inPlay: ['mighty-tiger', 'hunting-witch']
                    }
                });

                this.player1.play(this.ammoniaClouds);
            });

            it('should deal 3 damage to all creatures', function() {
                expect(this.troll.tokens.damage).toBe(3);
                expect(this.ancientBear.tokens.damage).toBe(3);
                expect(this.mightyTiger.tokens.damage).toBe(3);
                expect(this.huntingWitch.location).toBe('discard');
            });
        });
    });
});
