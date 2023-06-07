describe('The Visible Hand', function () {
    describe("The Visible Hand's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    token: 'grunt',
                    hand: ['the-visible-hand', 'pelf', 'clone-home']
                }
            });
        });

        it('makes 2 token creatures', function () {
            this.player1.play(this.theVisibleHand);
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
