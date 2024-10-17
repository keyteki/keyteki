describe('Firespitter', function () {
    describe("Firespitter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['firespitter']
                },
                player2: {
                    inPlay: ['urchin', 'snufflegator', 'silvertooth']
                }
            });
        });

        it('should deal 1 damage to all enemies before the fight', function () {
            this.player1.fightWith(this.firespitter, this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.snufflegator.tokens.damage).toBe(1);
            expect(this.silvertooth.tokens.damage).toBe(1);
        });
    });
});
