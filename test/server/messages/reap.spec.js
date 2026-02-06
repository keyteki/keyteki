describe('Reap Messages', function () {
    describe('reap', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ganger-chieftain']
                },
                player2: {}
            });
        });

        it('should log correct message when reaping', function () {
            this.player1.reap(this.gangerChieftain);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Ganger Chieftain to reap with Ganger Chieftain'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
