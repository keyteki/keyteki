describe('Capture Messages', function () {
    describe('capture amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['berinon']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when capturing amber', function () {
            this.player1.reap(this.berinon);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Berinon to reap with Berinon',
                'player1 uses Berinon to capture 2 amber from their opponent, placing it on Berinon'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
