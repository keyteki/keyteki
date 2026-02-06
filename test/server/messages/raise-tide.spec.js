describe('Raise Tide Messages', function () {
    describe('raise tide', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['freebooter-faye']
                },
                player2: {}
            });
        });

        it('should log correct message when raising the tide', function () {
            this.player1.play(this.freebooterFaye);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Freebooter Faye',
                'player1 uses Freebooter Faye to raise the tide'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
