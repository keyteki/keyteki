describe('Grey Monk', function () {
    describe("Grey Monk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['grey-monk', 'mother-northelle', 'bulwark']
                },
                player2: {
                    inPlay: ['collector-worm', 'angwish']
                }
            });
        });

        it('should increase armor of friendly creatures', function () {
            expect(this.greyMonk.armor).toBe(1);
            expect(this.bulwark.armor).toBe(3);
            expect(this.motherNorthelle.armor).toBe(3);
        });

        it('should heal two damage after reap', function () {
            this.player1.fightWith(this.bulwark, this.angwish);
            expect(this.bulwark.tokens.damage).toBe(3);
            this.player1.reap(this.greyMonk);
            expect(this.player1).toBeAbleToSelect(this.greyMonk);
            expect(this.player1).toBeAbleToSelect(this.bulwark);
            expect(this.player1).toBeAbleToSelect(this.motherNorthelle);
            expect(this.player1).toBeAbleToSelect(this.collectorWorm);
            expect(this.player1).toBeAbleToSelect(this.angwish);
            this.player1.clickCard(this.bulwark);
            expect(this.bulwark.tokens.damage).toBe(1);
        });
    });
});
