describe('YxlixMesmerist', function () {
    describe("YxlixMesmerist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 1,
                    inPlay: ['flaxia', 'yxlix-mesmerist']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should be able to select friendly creature and capture from self', function () {
            this.player1.useAction(this.yxlixMesmerist);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.flaxia.amber).toBe(1);
        });

        it('should be able to select enemy creature and capture from self', function () {
            this.player1.useAction(this.yxlixMesmerist);
            this.player1.clickCard(this.gub);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.gub.amber).toBe(1);
        });
    });
});
