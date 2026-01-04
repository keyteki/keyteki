describe('Golis Artificer', function () {
    describe("Golis Artificer's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    token: 'alpha-gamma',
                    inPlay: ['golis-artificer'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1
                }
            });

            this.alphaGamma1 = this.player1.player.deck[0];
        });

        it('should make a token creature on reap', function () {
            this.player1.reap(this.golisArtificer);
            this.player1.clickPrompt('Left');
            expect(this.alphaGamma1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
