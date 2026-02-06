describe('Forge Messages', function () {
    describe('forge key at start of turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed'
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('should log correct message when forging a key', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            expect(this).toHaveAllChatMessagesBe([
                'player1 draws 6 cards to their maximum of 6',
                'player1: 0 amber (0 keys) player2: 6 amber (0 keys)',
                'player2 forges the forgedkeyred, paying 6 amber',
                'player2 chooses untamed as their active house this turn'
            ]);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('forge key with modified cost', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['lash-of-broken-dreams']
                },
                player2: {
                    amber: 9
                }
            });
        });

        it('should log correct message when forging a key with increased cost', function () {
            this.player1.useAction(this.lashOfBrokenDreams);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            expect(this).toHaveAllChatMessagesBe([
                "player1 uses Lash of Broken Dreams to increase key cost by 3 during player2's next turn",
                'player1 readies their cards',
                'player1 draws 6 cards to their maximum of 6',
                'player1: 0 amber (0 keys) player2: 9 amber (0 keys)',
                'player2 forges the forgedkeyred, paying 9 amber',
                'player2 chooses untamed as their active house this turn'
            ]);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('forge key with key cheat', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 7,
                    house: 'untamed',
                    hand: ['key-charge']
                },
                player2: {}
            });
        });

        it('should log correct message when forging a key mid-turn', function () {
            this.player1.play(this.keyCharge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('Red');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Key Charge',
                'player1 uses Key Charge to make player1 lose 1 amber',
                'player1 forges the forgedkeyred, paying 6 amber'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
