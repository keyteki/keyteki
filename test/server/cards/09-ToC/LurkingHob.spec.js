describe('Lurking Hob', function () {
    describe("Lurking Hob's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'stooge',
                    inPlay: ['lurking-hob']
                },
                player2: {
                    amber: 1
                }
            });

            this.stooge1 = this.player1.player.deck[0];
        });

        it('should make a token on reap', function () {
            this.player1.reap(this.lurkingHob);
            this.player1.clickPrompt('Right');
            expect(this.stooge1.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
