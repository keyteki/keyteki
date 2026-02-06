describe('Poison Messages', function () {
    describe('fight with poison attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['macis-asp']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log fight message when poison creature fights', function () {
            this.player1.fightWith(this.macisAsp, this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Macis Asp to make Macis Asp fight Troll'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
