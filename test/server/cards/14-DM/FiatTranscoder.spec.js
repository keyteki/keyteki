describe('FiatTranscoder', function () {
    describe("Fiat Transcoder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 2,
                    inPlay: ['fiat-transcoder']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('loses 1 amber and takes control of an enemy creature', function () {
            this.player1.useAction(this.fiatTranscoder);
            this.player1.clickCard(this.urchin);
            expect(this.player1.amber).toBe(1);
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if player has no amber', function () {
            this.player1.amber = 0;
            this.player1.useAction(this.fiatTranscoder);
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
