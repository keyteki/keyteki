describe('Iyxrenu The Clever', function () {
    describe("Iyxrenu The Clever's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 1,
                    inPlay: ['iyxrenu-the-clever', 'ether-spider', 'yxlix-mesmerist']
                },
                player2: {
                    inPlay: ['tribute-collector']
                }
            });

            this.etherSpider.amber = 3;
            this.tributeCollector.amber = 2;
        });

        it('does nothing if no amber was lost', function () {
            this.player1.useAction(this.yxlixMesmerist);
            this.player1.clickCard(this.etherSpider);
            this.player1.useAction(this.iyxrenuTheClever);
            this.expectReadyToTakeAction(this.player1);
        });

        it('moves all amber from a creature to your pool if you lose 1', function () {
            this.player1.useAction(this.iyxrenuTheClever);
            this.player1.clickCard(this.etherSpider);
            expect(this.player1.amber).toBe(3);
        });

        it('also works on enemy creatures', function () {
            this.player1.useAction(this.iyxrenuTheClever);
            this.player1.clickCard(this.tributeCollector);
            expect(this.player1.amber).toBe(2);
        });
    });
});
