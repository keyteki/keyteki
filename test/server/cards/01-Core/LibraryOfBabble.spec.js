describe('Library of Babble', function () {
    describe("Library of Babble's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['library-of-babble']
                },
                player2: {}
            });
        });

        it('should draw a card on action', function () {
            let handSize = this.player1.hand.length;
            this.player1.useAction(this.libraryOfBabble);
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
