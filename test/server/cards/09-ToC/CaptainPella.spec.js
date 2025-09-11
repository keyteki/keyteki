describe('Captain Pella', function () {
    describe("Captain Pella's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'wrangler',
                    inPlay: ['captain-pella']
                },
                player2: {
                    amber: 2
                }
            });

            this.wrangler1 = this.player1.player.deck[0];
        });

        it('should make a token creature on reap', function () {
            this.player1.reap(this.captainPella);
            this.player1.clickPrompt('Right');
            expect(this.wrangler1.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
