describe('Elusive Messages', function () {
    describe('fight against elusive defender', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
        });

        it('should log fight message when attacking elusive creature', function () {
            this.player1.fightWith(this.troll, this.umbra);
            expect(this).toHaveAllChatMessagesBe(['player1 uses Troll to make Troll fight Umbra']);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
