describe('Energy Vampirism', function () {
    describe("Energy Vampirism's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['energy-vampirism'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 2,
                    inPlay: ['charette', 'cpo-zytar']
                }
            });
        });

        it('captures 1 onto an enemy creature from opponent', function () {
            this.player1.play(this.energyVampirism);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            this.player1.clickCard(this.charette);
            expect(this.charette.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
        });

        it('captures 1 onto a friendly creature from self', function () {
            this.player1.play(this.energyVampirism);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.amber).toBe(1);
        });

        it('does 1 D for each amber on the creature', function () {
            this.charette.amber = 2;
            this.player1.play(this.energyVampirism);
            this.player1.clickCard(this.charette);

            // Deal 3 damage.
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickCard(this.charette);
            expect(this.charette.damage).toBe(1);
            expect(this.cpoZytar.damage).toBe(1);
            expect(this.flaxia.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
