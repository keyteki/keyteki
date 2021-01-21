describe('Lightsmith Clariel', function () {
    describe("Lightsmith Clariel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'sanctum',
                    inPlay: ['lightsmith-clariel']
                },
                player2: {
                    amber: 4,
                    inPlay: ['nerotaurus']
                }
            });
        });

        it('should be an optional ability', function () {
            this.player1.fightWith(this.lightsmithClariel, this.nerotaurus);
            this.player1.clickPrompt('Done');
            expect(this.nerotaurus.tokens.damage).toBe(5);
            expect(this.lightsmithClariel.tokens.damage).toBe(4);
        });

        it('should allow swapping power and armor values', function () {
            this.player1.fightWith(this.lightsmithClariel, this.nerotaurus);
            this.player1.clickCard(this.lightsmithClariel);
            expect(this.nerotaurus.tokens.damage).toBe(2);
            expect(this.lightsmithClariel.tokens.damage).toBe(1);
        });

        it('should die before fight if swapping power and armor values', function () {
            this.lightsmithClariel.tokens.damage = 4;
            this.player1.fightWith(this.lightsmithClariel, this.nerotaurus);
            this.player1.clickCard(this.lightsmithClariel);
            expect(this.nerotaurus.tokens.damage).toBeUndefined();
            expect(this.lightsmithClariel.location).toBe('discard');
        });
    });
});
