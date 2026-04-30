describe('EvenSwap', function () {
    describe("Even Swap's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['even-swap'],
                    inPlay: ['urchin', 'snufflegator']
                },
                player2: {
                    inPlay: ['flaxia', 'exeldon-yash']
                }
            });
        });

        it('swaps two friendly and two enemy creatures', function () {
            this.player1.play(this.evenSwap);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            this.player1.clickCard(this.flaxia);
            this.player1.clickCard(this.exeldonYash);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Left');
            expect(this.urchin.controller).toBe(this.player2.player);
            expect(this.snufflegator.controller).toBe(this.player2.player);
            expect(this.flaxia.controller).toBe(this.player1.player);
            expect(this.exeldonYash.controller).toBe(this.player1.player);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if a side has fewer than 2 creatures', function () {
            this.player2.moveCard(this.flaxia, 'discard');
            this.player1.play(this.evenSwap);
            expect(this.urchin.controller).toBe(this.player1.player);
            expect(this.exeldonYash.controller).toBe(this.player2.player);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
