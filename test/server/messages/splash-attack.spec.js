describe('Splash-Attack Messages', function () {
    describe('fight with splash-attack attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['chasm-vespid']
                },
                player2: {
                    inPlay: ['troll', 'ganger-chieftain', 'krump']
                }
            });
        });

        it('should log fight message when splash-attack creature fights', function () {
            this.player1.fightWith(this.chasmVespid, this.gangerChieftain);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Chasm Vespid to make Chasm Vespid fight Ganger Chieftain'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
