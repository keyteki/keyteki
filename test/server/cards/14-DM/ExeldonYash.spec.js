describe('ExeldonYash', function () {
    describe("Exeldon Yash's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['troll'],
                    inPlay: ['exeldon-yash']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('captures 2 then discards a card to move 1 to pool', function () {
            this.player1.reap(this.exeldonYash);
            expect(this.exeldonYash.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt(
                'You may discard a card to move 1 amber to your pool'
            );
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.exeldonYash.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 2 and skips discard when player declines', function () {
            this.player1.reap(this.exeldonYash);
            this.player1.clickPrompt('Done');
            expect(this.exeldonYash.amber).toBe(2);
            expect(this.troll.location).toBe('hand');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
