describe('Doc Bookton', function () {
    describe("Doc Bookton's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['doc-bookton']
                },
                player2: {}
            });
        });

        it('should draw a card when reaped', function () {
            const handSize = this.player1.hand.length;
            this.player1.reap(this.docBookton);
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
