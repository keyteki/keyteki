describe('Kyypax Encapsulator', function () {
    describe("Kyypax Encapsulator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['kyypax-encapsulator', 'glylyx-weaponsmith']
                },
                player2: {
                    inPlay: ['brikk-nastee']
                }
            });
        });

        it('should let you send an enemy creature to archive', function () {
            this.player1.reap(this.kyypaxEncapsulator);
            expect(this.player1).toBeAbleToSelect(this.brikkNastee);
            expect(this.player1).not.toBeAbleToSelect(this.glylyxWeaponsmith);
            expect(this.player1).not.toBeAbleToSelect(this.kyypaxEncapsulator);
            this.player1.clickCard(this.brikkNastee);
            expect(this.brikkNastee.location).toBe('archives');
        });
    });
});
