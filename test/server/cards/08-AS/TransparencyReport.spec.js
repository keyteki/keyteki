describe('Transparency Report', function () {
    describe("Transparency Report's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['transparency-report', 'pen-pal', 'the-old-tinker', 'gub']
                }
            });
        });

        it('should not gain amber with other active house cards in hand', function () {
            this.player1.play(this.transparencyReport);
            expect(this.player1.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain amber with no other active house cards in hand', function () {
            this.player1.playCreature(this.penPal);
            this.player1.playCreature(this.theOldTinker);
            this.player1.play(this.transparencyReport);
            expect(this.player1.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain amber with empty hand', function () {
            this.player1.playCreature(this.penPal);
            this.player1.playCreature(this.theOldTinker);
            this.player1.moveCard(this.gub, 'discard');
            this.player1.play(this.transparencyReport);
            expect(this.player1.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
