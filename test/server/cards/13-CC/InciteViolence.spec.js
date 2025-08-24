describe('Incite Violence', function () {
    describe("Incite Violence's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['incite-violence'],
                    inPlay: ['troll', 'ancient-bear', 'foozle']
                },
                player2: {
                    inPlay: ['batdrone', 'doc-bookton']
                }
            });
        });

        it('should give all friendly creatures splash-attack 1 for the turn', function () {
            this.player1.play(this.inciteViolence);
            expect(this.troll.getKeywordValue('splash-attack')).toBe(1);
            expect(this.ancientBear.getKeywordValue('splash-attack')).toBe(1);
            expect(this.foozle.getKeywordValue('splash-attack')).toBe(1);
            expect(this.batdrone.getKeywordValue('splash-attack')).toBe(0);
            expect(this.docBookton.getKeywordValue('splash-attack')).toBe(0);

            this.player1.fightWith(this.troll, this.batdrone);
            expect(this.docBookton.tokens.damage).toBe(1);

            this.player1.endTurn();
            expect(this.troll.getKeywordValue('splash-attack')).toBe(0);
            expect(this.ancientBear.getKeywordValue('splash-attack')).toBe(0);
            expect(this.foozle.getKeywordValue('splash-attack')).toBe(0);
        });
    });
});
