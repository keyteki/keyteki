describe('Assault Messages', function () {
    describe('fight with assault attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['shorty']
                },
                player2: {
                    inPlay: ['dodger']
                }
            });
        });

        it('should log fight message when assault creature fights', function () {
            this.player1.fightWith(this.shorty, this.dodger);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Shorty to make Shorty fight Dodger',
                'player1 uses Shorty to deal 4 damage to Dodger'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
