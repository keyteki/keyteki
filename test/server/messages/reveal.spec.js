describe('Reveal Messages', function () {
    describe('reveal hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['the-visible-hand', 'dextre']
                },
                player2: {}
            });
        });

        it('should log correct message when revealing hand', function () {
            this.player1.play(this.theVisibleHand);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays The Visible Hand',
                'player1 uses The Visible Hand to make 2 token creatures; and reveal Dextre'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
