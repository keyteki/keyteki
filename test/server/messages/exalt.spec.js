describe('Exalt Messages', function () {
    describe('exalt a creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['senator-shrix']
                },
                player2: {}
            });
        });

        it('should log exalt message', function () {
            this.player1.play(this.senatorShrix);
            this.player1.clickCard(this.senatorShrix);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Senator Shrix',
                'player1 uses Senator Shrix to exalt Senator Shrix'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
