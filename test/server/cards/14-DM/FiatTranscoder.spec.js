describe('FiatTranscoder', function () {
    describe("Fiat Transcoder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 2,
                    inPlay: ['fiat-transcoder', 'bumpsy']
                },
                player2: {
                    inPlay: ['urchin', 'flaxia', 'troll']
                }
            });
        });

        it('loses 1 amber and takes control of an enemy creature', function () {
            this.player1.useAction(this.fiatTranscoder);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.urchin);
            this.player1.clickPrompt('Left');
            expect(this.player1.amber).toBe(1);
            expect(this.bumpsy.controller).toBe(this.player1.player);
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.troll.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if player has no amber', function () {
            this.player1.amber = 0;
            this.player1.useAction(this.fiatTranscoder);
            expect(this.bumpsy.controller).toBe(this.player1.player);
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.flaxia.controller).toBe(this.player2.player);
            expect(this.troll.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
