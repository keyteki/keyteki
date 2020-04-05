describe('dark-centurion', function() {
    integration(function() {
        describe('Dark Centurion\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'saurian',
                        inPlay: ['umbra','dark-centurion'],
                        hand: ['access-denied']
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['troll']
                    }
                });
            });

            it('should be able to remove one aember from a creature that this player controls, and ward it', function() {
                this.umbra.tokens.amber = 1;
                expect(this.umbra.hasToken('amber')).toBe(true);

                expect(this.darkCenturion.location).toBe('play area');
                this.player1.clickCard(this.darkCenturion);
                expect(this.player1).toHavePromptButton('Use this card\'s Action ability');
                this.player1.clickPrompt('Use this card\'s Action ability');

                expect(this.player1).toBeAbleToSelect(this.umbra);
                this.player1.clickCard(this.umbra);

                expect(this.umbra.hasToken('amber')).toBe(false);
                expect(this.umbra.hasToken('ward')).toBe(true);
                expect(this.darkCenturion.hasToken('ward')).toBe(false);
            });

            it('should be able to remove one aember from a creature that the opponent controls, and ward it', function() {
                this.umbra.tokens.amber = 1;
                this.troll.tokens.amber = 1;

                expect(this.umbra.hasToken('amber')).toBe(true);
                expect(this.troll.hasToken('amber')).toBe(true);

                expect(this.darkCenturion.location).toBe('play area');
                this.player1.clickCard(this.darkCenturion);
                expect(this.player1).toHavePromptButton('Use this card\'s Action ability');
                this.player1.clickPrompt('Use this card\'s Action ability');

                expect(this.player1).toBeAbleToSelect(this.umbra);
                expect(this.player1).toBeAbleToSelect(this.troll);
                this.player1.clickCard(this.troll);

                expect(this.umbra.hasToken('amber')).toBe(true);
                expect(this.umbra.hasToken('ward')).toBe(false);

                expect(this.troll.hasToken('amber')).toBe(false);
                expect(this.troll.hasToken('ward')).toBe(true);
            });
        });
    });
});
