describe('Three Sheets to the Wind', function () {
    describe("Three Sheets to the Wind's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['three-sheets-to-the-wind']
                },
                player2: {
                    hand: ['krump'],
                    discard: ['anger', 'troll', 'punch']
                }
            });

            this.player2.moveCard(this.anger, 'deck');
            this.player2.moveCard(this.troll, 'deck');
            this.player2.moveCard(this.punch, 'deck');
        });

        it('should cause opponent to draw 3 cards, then discard one, return one to deck, and purge one', function () {
            let deckLen = this.player2.player.deck.length;
            this.player1.play(this.threeSheetsToTheWind);
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player2.player.deck.length).toBe(deckLen - 2);
            expect(this.player2.player.purged.length).toBe(1);
            expect(this.player2.player.discard.length).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should work even with no deck or discard', function () {
            this.player2.player.deck = [];
            this.player2.player.discard = [];
            this.player1.play(this.threeSheetsToTheWind);
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.player2.player.deck.length).toBe(0);
            expect(this.player2.player.purged.length).toBe(0);
            expect(this.player2.player.discard.length).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
