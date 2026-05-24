describe('Copy Text Box Messages', function () {
    describe('Doppelganger copying a neighbor', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['umbra', 'doppelganger', 'hunting-witch']
                }
            });
        });

        it('should log correct message when Doppelganger copies a neighbor', function () {
            this.player1.endTurn();
            this.player2.clickCard(this.umbra);
            this.player2.clickPrompt('geistoid');
            expect(this.player2).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 uses Doppelganger to have Doppelganger gain the text box of Umbra for the remainder of the turn',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber',
                'player2 chooses geistoid as their active house this turn'
            ]);
        });
    });
});
