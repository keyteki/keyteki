describe('Skirmish Messages', function () {
    describe('fight with skirmish attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['umbra']
                },
                player2: {
                    inPlay: ['ganger-chieftain']
                }
            });
        });

        it('should log fight message when skirmish creature fights', function () {
            this.player1.fightWith(this.umbra, this.gangerChieftain);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Umbra to make Umbra fight Ganger Chieftain'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
