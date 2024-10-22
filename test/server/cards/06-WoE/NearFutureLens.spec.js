describe('Near-Future Lens', function () {
    describe("Near-Future Len's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: [
                        'pelf',
                        'near-future-lens',
                        'help-from-future-self',
                        'blood-of-titans',
                        'curse-of-cowardice'
                    ],
                    discard: ['timetraveller']
                },
                player2: {
                    amber: 1,
                    inPlay: ['shooler', 'uncommon-currency'],
                    hand: ['gub']
                }
            });
        });

        it('should make the top card of your deck visible', function () {
            this.topCard = this.player1.player.deck[0];
            expect(this.topCard.getSummary(this.player1.player).facedown).toBe(false);
            expect(this.topCard.getSummary(this.player2.player).facedown).toBe(true);

            this.player1.play(this.nearFutureLens);

            expect(this.topCard.getSummary(this.player1.player).facedown).toBe(false);
            expect(this.topCard.getSummary(this.player2.player).facedown).toBe(false);

            this.player1.endTurn();
        });

        it('should make the top card of your deck playable', function () {
            this.player1.play(this.nearFutureLens);
            this.player1.play(this.pelf);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');

            // All cards in the deck are Anger.
            this.player1.useAction(this.nearFutureLens, true);
            this.player1.clickCard(this.pelf);
            this.player1.clickCard(this.shooler);
            expect(this.player2.amber).toBe(0);

            // New top card is faceup to both players.
            expect(this.player1.deck[0].getSummary(this.player1.player).facedown).toBe(false);
            expect(this.player1.deck[0].getSummary(this.player2.player).facedown).toBe(false);
        });

        it('should work after a shuffle', function () {
            this.player1.play(this.nearFutureLens);
            this.player1.play(this.pelf);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');

            this.player1.play(this.helpFromFutureSelf);
            this.player1.clickCard(this.timetraveller);
            this.player1.clickPrompt('Done');

            // New top card after shuffle is faceup to both players.
            expect(this.player1.deck[0].getSummary(this.player1.player).facedown).toBe(false);
            expect(this.player1.deck[0].getSummary(this.player2.player).facedown).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should add a chat message for the next top card of the deck for uprades', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.moveCard(this.bloodOfTitans, 'deck');
            this.player1.play(this.nearFutureLens);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Near-Future Lens to reveal Blood of Titans'
            );
            this.nearFutureLens.ready();
            this.player1.useAction(this.nearFutureLens, true);
            this.player1.clickCard(this.shooler);
            expect(this).toHaveRecentChatMessage('player1 uses Near-Future Lens to reveal Pelf', 2);
        });

        it('should add a chat message for the next top card of the deck has treachery', function () {
            this.player1.moveCard(this.pelf, 'deck');
            this.player1.moveCard(this.curseOfCowardice, 'deck');
            this.player1.play(this.nearFutureLens);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Near-Future Lens to reveal Curse of Cowardice'
            );
            this.nearFutureLens.ready();
            this.player1.useAction(this.nearFutureLens, true);
            expect(this).toHaveRecentChatMessage('player1 uses Near-Future Lens to reveal Pelf');
        });

        it('should add a chat message when control changes', function () {
            this.player2.moveCard(this.gub, 'deck');
            this.player1.play(this.nearFutureLens);
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.useAction(this.uncommonCurrency);
            this.player2.clickCard(this.nearFutureLens);
            expect(this.player2.deck[0].getSummary(this.player1.player).facedown).toBe(false);
            expect(this).toHaveRecentChatMessage('player2 uses Near-Future Lens to reveal Gub');
        });
    });
});
