describe('Unforge Messages', function () {
    describe('unforge key', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['turnkey']
                },
                player2: {}
            });
        });

        it('should log correct message when unforging a key', function () {
            this.player2.player.keys = { red: true, blue: false, yellow: false };
            this.player1.play(this.turnkey);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Turnkey',
                'player1 uses Turnkey to cause player2 to unforge a key',
                "player1 unforges player2's forgedkeyred"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
