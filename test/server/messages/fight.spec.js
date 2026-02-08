describe('Fight Messages', function () {
    describe('fight', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['ganger-chieftain']
                }
            });
        });

        it('should log correct message when fighting', function () {
            this.player1.fightWith(this.troll, this.gangerChieftain);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Troll to make Troll fight Ganger Chieftain'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('before fight', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['firespitter']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log correct message for before fight ability', function () {
            this.player1.fightWith(this.firespitter, this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Firespitter to make Firespitter fight Troll',
                'player1 uses Firespitter to deal 1 damage to each enemy creature'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
