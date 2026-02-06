describe('Omega Messages', function () {
    describe('play omega card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['unlocked-gateway'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should log play message for omega card', function () {
            this.player1.play(this.unlockedGateway);
            this.player2.clickPrompt('brobnar');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Unlocked Gateway',
                'player1 uses Unlocked Gateway to destroy Ember Imp and Troll',
                'player1 played Unlocked Gateway which has Omega, ending this step',
                'player1 draws 6 cards to their maximum of 6',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber ',
                'player2 chooses brobnar as their active house this turn'
            ]);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
