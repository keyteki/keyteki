describe('Shuffle Messages', function () {
    describe('shuffle into deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['mab-the-mad']
                },
                player2: {}
            });
        });

        it('should log correct message when shuffling card into deck', function () {
            this.player1.reap(this.mabTheMad);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Mab the Mad to reap with Mab the Mad',
                "player1 uses Mab the Mad to return Mab the Mad to their owner's deck"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
