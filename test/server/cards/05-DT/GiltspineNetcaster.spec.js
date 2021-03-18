describe('Giltspine Netcaster', function () {
    describe("Giltspine Netcaster's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    inPlay: ['giltspine-netcaster', 'flaxia']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should exhaust a creature', function () {
            this.player1.reap(this.giltspineNetcaster);

            expect(this.player1).toBeAbleToSelect(this.giltspineNetcaster);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);

            this.player1.clickCard(this.krump);
            expect(this.giltspineNetcaster.exhausted).toBe(true);
            expect(this.flaxia.exhausted).toBe(false);
            expect(this.gub.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(true);
        });
    });
});
