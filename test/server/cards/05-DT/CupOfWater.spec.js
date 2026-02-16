describe('Cup of Water', function () {
    describe('Cup of Waters ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['cup-of-water'],
                    inPlay: ['flaxia', 'mother', 'eyegor']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'batdrone', 'archimedes']
                }
            });
            this.player1.play(this.cupOfWater);
        });

        it('should stun all cyborgs and robots', function () {
            expect(this.flaxia.stunned).toBe(false);
            expect(this.mother.stunned).toBe(true);
            expect(this.eyegor.stunned).toBe(true);
            expect(this.gub.stunned).toBe(false);
            expect(this.batdrone.stunned).toBe(true);
            expect(this.archimedes.stunned).toBe(true);
        });
    });
});
