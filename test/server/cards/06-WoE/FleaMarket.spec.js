describe('Flea Market', function () {
    describe("Flea Market's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'ekwidon',
                    inPlay: ['flea-market']
                },
                player2: {
                    amber: 2,
                    hand: ['selwyn-the-fence']
                }
            });
        });

        it('allows player to play a random card from opponent hand', function () {
            this.player1.useAction(this.fleaMarket);
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');
            this.player1.clickPrompt('Yes');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.selwynTheFence.location).toBe('play area');
            expect(this.player1.player.cardsInPlay).toContain(this.selwynTheFence);
            expect(this.player2.player.cardsInPlay).not.toContain(this.selwynTheFence);
            expect(this.player2.hand.length).toBe(0);
        });

        it('does not prompt if there is no amber', function () {
            this.player1.amber = 0;
            this.player1.useAction(this.fleaMarket);
            expect(this).toHaveRecentChatMessage('Flea Market reveals Selwyn the Fence');
            expect(this.player1).not.toHavePromptButton('Yes');
            expect(this.player1).not.toHavePromptButton('No');
            expect(this.player1.amber).toBe(0);
            expect(this.selwynTheFence.location).toBe('hand');
        });
    });
});
