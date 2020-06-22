describe('Ballcano', function () {
    describe("Ballcano's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['ballcano'],
                    inPlay: ['urchin', 'nexus']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
        });

        it('should deal 4 damage to all creatures', function () {
            this.player1.play(this.ballcano);
            expect(this.urchin.location).toBe('discard');
            expect(this.nexus.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.mother.tokens.damage).toBe(4);
            expect(this.zorg.tokens.damage).toBe(4);
            expect(this.player1.chains).toBe(2);
        });
    });
});
