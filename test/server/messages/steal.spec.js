describe('Steal Messages', function () {
    describe('steal amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['urchin']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should log correct message when stealing amber', function () {
            this.player1.playCreature(this.urchin);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Urchin',
                'player1 uses Urchin to steal 1 amber from player2'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
