describe('Redhawk', function () {
    describe("Redhawk's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'wrangler',
                    inPlay: ['redhawk']
                },
                player2: {
                    amber: 3
                }
            });

            this.wrangler1 = this.player1.player.deck[0];
        });

        it('should make each player gain one and make a token creature', function () {
            this.player1.useAction(this.redhawk);
            this.player1.clickPrompt('Right');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.wrangler1.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
