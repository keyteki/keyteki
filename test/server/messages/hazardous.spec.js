describe('Hazardous Messages', function () {
    describe('fight against hazardous defender', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['briar-grubbling']
                }
            });
        });

        it('should log fight message when attacking hazardous creature', function () {
            this.player1.fightWith(this.troll, this.briarGrubbling);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Troll to make Troll fight Briar Grubbling',
                'player2 uses Briar Grubbling to deal 5 damage to Troll'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
