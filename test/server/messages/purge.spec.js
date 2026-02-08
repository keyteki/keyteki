describe('Purge Messages', function () {
    describe('purge a creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['the-harder-they-come']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log correct message when purging a creature', function () {
            this.player1.play(this.theHarderTheyCome);
            this.player1.clickCard(this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays The Harder They Come',
                'player1 uses The Harder They Come to purge Troll'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
