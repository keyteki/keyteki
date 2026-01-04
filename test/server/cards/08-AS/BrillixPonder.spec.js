describe('Brillix Ponder', function () {
    describe("Brillix Ponder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['brillix-ponder']
                },
                player2: {}
            });
        });

        it('draws a card on scrap', function () {
            this.player1.scrap(this.brillixPonder);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
