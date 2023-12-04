describe('Poison Wave', function () {
    describe("Poison Wave's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['poison-wave'],
                    inPlay: ['urchin', 'nexus']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
        });

        it('should deal 2 damage to all creatures', function () {
            this.player1.play(this.poisonWave);
            expect(this.urchin.location).toBe('discard');
            expect(this.nexus.tokens.damage).toBe(2);
            expect(this.batdrone.location).toBe('discard');
            expect(this.mother.tokens.damage).toBe(2);
            expect(this.zorg.tokens.damage).toBe(2);
        });
    });
});
