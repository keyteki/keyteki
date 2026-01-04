describe('Dr. Westing', function () {
    describe("Dr. Westing's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'logos',
                    token: 'alpha-gamma',
                    hand: ['helper-bot'],
                    inPlay: ['flaxia', 'dr-westing'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1
                }
            });

            this.alphaGamma1 = this.player1.player.deck[0];
        });

        it('should make a token on reap when on flank', function () {
            this.player1.reap(this.drWesting);
            this.player1.clickPrompt('Left');
            expect(this.alphaGamma1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not make a token on reap when not on flank', function () {
            this.player1.playCreature(this.helperBot);
            this.player1.reap(this.drWesting);
            expect(this.alphaGamma1.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
