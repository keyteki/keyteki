describe('Power Counter Messages', function () {
    describe('+1 power counter bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['troll'],
                    inPlay: ['krump']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });

            this.troll.enhancements = ['power'];
        });

        it('should log correct message when adding a +1 power counter due to bonus icon', function () {
            this.player1.play(this.troll);
            this.player1.clickCard(this.krump);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Troll',
                "player1 uses Troll's power bonus icon to add a +1 power counter to Krump"
            ]);
        });
    });
});
