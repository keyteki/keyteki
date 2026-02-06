describe('Deploy Messages', function () {
    describe('play creature with deploy', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['almsmaster'],
                    inPlay: ['troll']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should log play message when deploying creature', function () {
            this.player1.play(this.almsmaster);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Almsmaster',
                'player1 uses Almsmaster to capture 1 amber from their opponent, placing it on Troll'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
