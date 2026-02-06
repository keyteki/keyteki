describe('Enrage Messages', function () {
    describe('enrage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['pestering-blow']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log correct message when enraging a creature', function () {
            this.player1.play(this.pesteringBlow);
            this.player1.clickCard(this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Pestering Blow',
                "player1 gains an amber due to Pestering Blow's bonus icon",
                'player1 uses Pestering Blow to deal 1 damage and enrage Troll'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
