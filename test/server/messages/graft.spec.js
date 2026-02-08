describe('Graft Messages', function () {
    describe('graft action card onto creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['infomancer', 'berserker-slam']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log graft message when grafting a card', function () {
            this.player1.play(this.infomancer);
            this.player1.clickCard(this.berserkerSlam);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Infomancer',
                'player1 uses Infomancer to graft Berserker Slam onto Infomancer'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should log message when using grafted card effect', function () {
            this.player1.play(this.infomancer);
            this.player1.clickCard(this.berserkerSlam);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.reap(this.infomancer);
            this.player1.clickCard(this.berserkerSlam);
            this.player1.clickCard(this.troll);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Infomancer',
                'player1 uses Infomancer to graft Berserker Slam onto Infomancer',
                'player1 readies their cards',
                'player1 draws 6 cards to their maximum of 6',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber',
                'player2 chooses untamed as their active house this turn',
                'player2 readies their cards',
                'player2 draws 6 cards to their maximum of 6',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player1 does not forge a key.  They have 0 amber.  The current cost is 6 amber',
                'player1 chooses brobnar as their active house this turn',
                'player1 uses Infomancer to reap with Infomancer',
                'player1 uses Infomancer to trigger the play effect of Berserker Slam',
                'player1 uses Berserker Slam to deal 4 damage to Troll'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
