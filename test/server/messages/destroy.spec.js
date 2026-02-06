describe('Destroy Messages', function () {
    describe('destroy from fight', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should log correct message when destroying a creature from fight', function () {
            this.player1.fightWith(this.troll, this.emberImp);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Troll to make Troll fight Ember Imp'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('destroy from action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['punch']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should log correct message when destroying a creature from action', function () {
            this.player1.play(this.punch);
            this.player1.clickCard(this.emberImp);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Punch',
                "player1 gains an amber due to Punch's bonus icon",
                'player1 uses Punch to deal 3 damage to Ember Imp'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
