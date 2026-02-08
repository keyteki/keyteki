describe('Treachery Messages', function () {
    describe('play treachery card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['curse-of-cowardice']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log play message for treachery card', function () {
            this.player1.play(this.curseOfCowardice);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Curse of Cowardice',
                'player2 plays Curse of Cowardice'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
