describe('Zartoo, the Swift', function () {
    describe("Zartoo, the Swift's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['zartoo-the-swift', 'urchin', 'caspart']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('readies and uses a friendly non-Dragon creature on reap', function () {
            this.urchin.exhaust();
            const before = this.player1.amber;
            this.player1.reap(this.zartooTheSwift);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.exhausted).toBe(true);
            // zartoo reap +1 + urchin reap +1
            expect(this.player1.amber).toBe(before + 2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot target Dragon creature', function () {
            this.player1.moveCard(this.urchin, 'discard');
            this.player1.reap(this.zartooTheSwift);
            // No valid (non-Dragon) targets; ability does nothing.
            expect(this.caspart.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
