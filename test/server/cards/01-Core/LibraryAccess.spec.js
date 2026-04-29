describe('Library Access', function () {
    describe("Library Access's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['library-access', 'dextre', 'wild-wormhole'],
                    deck: []
                },
                player2: {}
            });
        });

        it('should draw a card after playing another card and purge itself', function () {
            let handSize = this.player1.hand.length;
            this.player1.play(this.libraryAccess);
            expect(this.libraryAccess.location).toBe('purged');
            expect(this.player1.hand.length).toBe(handSize - 1);
            this.player1.playCreature(this.dextre);
            this.player1.clickPrompt('Library Access');
            expect(this.player1.hand.length).toBe(handSize - 1);
            this.player1.play(this.wildWormhole); // Plays Foggify
            this.player1.clickPrompt('Library Access'); // Draw for Wild Wormhole
            this.player1.clickPrompt('Library Access'); // Draw for Foggify
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
