describe('Ornate Talking Tray', function () {
    describe("Ornate Talking Tray's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'grumpus',
                    inPlay: ['ornate-talking-tray']
                }
            });
        });

        it('should destroy itself and make a token creature', function () {
            this.player1.useAction(this.ornateTalkingTray, true);
            expect(this.ornateTalkingTray.location).toBe('discard');
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
        });
    });
});
