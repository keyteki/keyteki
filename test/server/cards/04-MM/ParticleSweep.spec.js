describe('particle-sweep', function () {
    describe("Particle Sweep's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: [
                        'chief-engineer-walls',
                        'cxo-taber',
                        'sci-officer-qincan',
                        'tactical-officer-moon'
                    ],
                    hand: ['particle-sweep']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'dysania']
                }
            });
        });

        it('should do two damage to a non-mutant', function () {
            this.player1.play(this.particleSweep);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dysania);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
        });

        it('should do destroy to mutant', function () {
            this.player1.play(this.particleSweep);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dysania);
            this.player1.clickCard(this.dysania);
            expect(this.dysania.location).toBe('discard');
        });
    });
});
