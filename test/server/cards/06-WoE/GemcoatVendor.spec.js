describe('Gemcoat Vendor', function () {
    describe("Gemcoat Vendor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    inPlay: ['gemcoat-vendor', 'flaxia']
                },
                player2: {
                    amber: 5,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should steal 1A and deal 1 damage to itself', function () {
            this.player1.useAction(this.gemcoatVendor);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.gemcoatVendor.damage).toBe(1);
            expect(this.flaxia.damage).toBe(0);
            expect(this.gub.damage).toBe(0);
            expect(this.krump.damage).toBe(0);
        });
    });
});
