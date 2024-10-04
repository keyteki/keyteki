describe('Moon Light Special', function () {
    describe("Moon Light Special's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['moon-light-special', 'umbra']
                },
                player2: {
                    amber: 1,
                    hand: ['lamindra']
                }
            });
        });

        it('should cause self to discard a cards and gain an amber', function () {
            this.player1.play(this.moonLightSpecial);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.umbra.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not gain an amber if no cards to discard', function () {
            this.player1.moveCard(this.umbra, 'discard');
            this.player1.play(this.moonLightSpecial);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.umbra.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
