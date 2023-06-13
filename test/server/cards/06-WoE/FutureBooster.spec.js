describe('Future Booster', function () {
    describe("Future Booster's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['future-booster'],
                    hand: ['batdrone']
                }
            });

            this.player1.moveCard(this.batdrone, 'deck');
        });

        it('should allow keeping the top card of the deck there', function () {
            this.player1.useAction(this.futureBooster, true);
            expect(this.player1).toHavePromptCardButton(this.batdrone);
            expect(this.player1).toHavePromptButton('Leave on top of deck');
            this.player1.clickPrompt('Leave on top of deck');
            expect(this.player1.deck[0]).toBe(this.batdrone);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow moving the card to the bottom', function () {
            this.player1.useAction(this.futureBooster, true);
            this.player1.clickPrompt('batdrone');
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(
                this.batdrone
            );
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should do nothing with an empty deck', function () {
            this.player1.player.deck = [];
            this.player1.useAction(this.futureBooster, true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
