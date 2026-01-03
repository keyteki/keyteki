describe('Wrecker', function () {
    describe("Wrecker's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    token: 'wrecker',
                    inPlay: ['wrecker:toad', 'touchstone']
                },
                player2: {
                    amber: 1,
                    hand: ['helper-bot']
                }
            });

            this.wrecker = this.player1.player.creaturesInPlay[0];
            this.p1card = this.player1.player.deck[0];
            this.p2card = this.player2.player.deck[0];
        });

        it('should discard a card from your deck', function () {
            this.player1.reap(this.wrecker);
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton("Opponent's");
            this.player1.clickPrompt('Mine');
            expect(this.p1card.location).toBe('discard');
            expect(this.p2card.location).toBe('deck');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should discard a card from opponent deck', function () {
            this.player1.reap(this.wrecker);
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton("Opponent's");
            this.player1.clickPrompt("Opponent's");
            expect(this.p2card.location).toBe('discard');
            expect(this.p1card.location).toBe('deck');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
