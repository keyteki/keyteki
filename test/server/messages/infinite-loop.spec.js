describe('Infinite Loop Messages', function () {
    describe('Doppelganger adjacent to another Doppelganger', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['doppelganger', 'doppelganger']
                }
            });

            const doppelgangers = this.player2.filterCardsByName('doppelganger', 'play area');
            this.doppelgangerA = doppelgangers[0];
            this.doppelgangerB = doppelgangers[1];
        });

        it('should log correct message when a player breaks out of an infinite loop', function () {
            this.player1.endTurn();

            // First resolution for Doppelganger A - cannot break out yet.
            this.player2.clickCard(this.doppelgangerA);
            this.player2.clickCard(this.doppelgangerB);

            // Second resolution for Doppelganger A - escape becomes available.
            this.player2.clickCard(this.doppelgangerA);
            this.player2.clickPrompt('Move to discard');

            // First resolution for Doppelganger B - cannot break out yet.
            this.player2.clickCard(this.doppelgangerB);
            this.player2.clickCard(this.doppelgangerA);

            this.player2.clickPrompt('geistoid');
            expect(this.player2).isReadyToTakeAction();
            expect(this.doppelgangerA.location).toBe('discard');
            expect(this.doppelgangerB.location).toBe('play area');
            expect(this).toHaveAllChatMessagesBe([
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 uses Doppelganger to have Doppelganger gain the text box of Doppelganger for the remainder of the turn',
                'player2 resolves the infinite loop by moving Doppelganger to the discard pile',
                'player2 does not forge a key. They have 0 amber. The current cost is 6 amber',
                'player2 chooses geistoid as their active house this turn'
            ]);
        });
    });
});
