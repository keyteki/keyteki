describe('Axiom of Grisk', function() {
    integration(function() {
        describe('Axiom of Grisk\'s play ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'saurian',
                        inPlay: ['troll', 'valdr', 'krump'],
                        hand: ['axiom-of-grisk']
                    },
                    player2: {
                        amber: 6,
                        inPlay: ['lamindra', 'groggins']
                    }
                });

                this.troll.tokens['amber'] = 1;
                this.lamindra.tokens['amber'] = 3;
            });

            it('Destroy each creature without amber', function() {
                this.player1.play(this.axiomOfGrisk);

                expect(this.player1).toHavePrompt('Choose a creature to ward');

                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).toBeAbleToSelect(this.valdr);
                expect(this.player1).toBeAbleToSelect(this.krump);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.groggins);

                this.player1.clickCard(this.krump);
                expect(this.player1.chains).toBe(2);

                expect(this.krump.location).toBe('play area');
                expect(this.krump.warded).toBe(false);
                expect(this.troll.location).toBe('play area');
                expect(this.lamindra.location).toBe('play area');

                expect(this.valdr.location).toBe('discard');
                expect(this.groggins.location).toBe('discard');
            });
        });
    });
});
