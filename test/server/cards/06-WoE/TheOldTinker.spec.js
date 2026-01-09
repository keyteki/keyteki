describe('The Old Tinker', function () {
    describe("The Old Tinker's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['the-old-tinker'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        it('should discard a card and draw a card when used to reap', function () {
            this.player1.reap(this.theOldTinker);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('The Old Tinker');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            this.player1.clickCard(this.soulkeeper);
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.player1.hand.length).toBe(1);
        });

        it('should not draw a card when used to reap when there is nothing to discard', function () {
            this.player1.moveCard(this.soulkeeper, 'deck');
            this.player1.reap(this.theOldTinker);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickCard(this.soulkeeper);
            expect(this.soulkeeper.location).toBe('deck');
            expect(this.player1.hand.length).toBe(0);
        });
    });
});
