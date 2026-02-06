describe('Token Creature Messages', function () {
    describe('make a token creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['tourist-trap']
                },
                player2: {}
            });
        });

        it('should log correct message when making a token creature', function () {
            this.player1.play(this.touristTrap);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Tourist Trap',
                'player1 plays Tourist Trap',
                'player1 uses Tourist Trap to make a token creature'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
