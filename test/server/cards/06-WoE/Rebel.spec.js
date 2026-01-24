describe('Rebel', function () {
    describe("Rebel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 1,
                    token: 'rebel',
                    inPlay: ['flaxia', 'rebel:world-tree', 'ether-spider']
                },
                player2: {
                    amber: 1,
                    inPlay: ['shooler', 'gub', 'krump']
                }
            });

            this.player1.reap(this.rebel);
        });

        it('should be able to select enemy and friendly creatures to deal 1D', function () {
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.rebel);
            expect(this.player1).toBeAbleToSelect(this.etherSpider);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.shooler);
        });

        it('should be to deal 1D to friendly creature', function () {
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.damage).toBe(1);
        });

        it('should be to deal 1D to enemy creature', function () {
            this.player1.clickCard(this.gub);
            expect(this.gub.damage).toBe(1);
        });
    });
});
