describe('Kerwollop', function () {
    describe("Kerwollop's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['bad-penny', 'dextre', 'archimedes', 'mooncurser'],
                    hand: ['kerwollop']
                },
                player2: {
                    inPlay: ['lamindra', 'armsmaster-molina']
                }
            });

            this.mooncurser.ward();
        });

        it('should deal 1D to each creature and gain 1A for each destroyed creature', function () {
            this.player1.play(this.kerwollop);
            expect(this.badPenny.location).toBe('hand');
            expect(this.lamindra.location).toBe('discard');
            expect(this.mooncurser.location).toBe('play area');
            expect(this.mooncurser.warded).toBe(false);
            expect(this.dextre.damage).toBe(1);
            expect(this.archimedes.damage).toBe(1);
            expect(this.armsmasterMolina.damage).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });
    });
});
