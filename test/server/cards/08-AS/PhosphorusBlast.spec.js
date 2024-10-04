describe('Phosphorus Blast', function () {
    describe("Phosphorus Blast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['phosphorus-blast'],
                    inPlay: ['glylyx-weaponsmith', 'thunderdell', 'gemcoat-vendor']
                },
                player2: {
                    inPlay: ['brikk-nastee', 'myx-the-tallminded']
                }
            });
        });

        it('should deal 2D to each non-Mars creature', function () {
            this.player1.play(this.phosphorusBlast);
            expect(this.thunderdell.tokens.damage).toBe(2);
            expect(this.gemcoatVendor.tokens.damage).toBe(2);
            expect(this.brikkNastee.tokens.damage).toBe(2);
            expect(this.glylyxWeaponsmith.tokens.damage).toBeUndefined();
            expect(this.myxTheTallminded.tokens.damage).toBeUndefined();
        });
    });
});
