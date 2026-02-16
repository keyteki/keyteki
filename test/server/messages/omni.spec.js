describe('Omni Ability Messages', function () {
    describe('omni ability on artifact', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['ornate-talking-tray']
                },
                player2: {}
            });
        });

        it('should log correct message when using omni ability from different house', function () {
            this.player1.useOmni(this.ornateTalkingTray);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Ornate Talking Tray to destroy Ornate Talking Tray and make a token creature',
                'Ornate Talking Tray is destroyed'
            ]);
        });
    });
});
