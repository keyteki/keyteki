describe('Cauldron', function () {
    describe("Cauldron's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['dust-pixie'],
                    inPlay: ['cauldron', 'near-future-lens'],
                    discard: ['witch-of-the-eye', 'ganger-chieftain', 'smith']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
            this.player1.chains = 36;
            this.player1.moveCard(this.smith, 'deck');
            this.player1.moveCard(this.gangerChieftain, 'deck');
            this.player1.moveCard(this.witchOfTheEye, 'deck');
        });

        it('place top card of deck under itself', function () {
            this.player1.useAction(this.cauldron, true);
            expect(this.cauldron.childCards).toContain(this.witchOfTheEye);
        });

        it('place top 3 cards of deck under itself then play them', function () {
            this.player1.useAction(this.cauldron, true);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.useAction(this.cauldron, true);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.useAction(this.cauldron, true);
            this.player1.clickCard(this.witchOfTheEye);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(4);
            expect(this.cauldron.childCards.length).toBe(0);
            expect(this.witchOfTheEye.location).toBe('play area');
            expect(this.gangerChieftain.location).toBe('play area');
            expect(this.smith.location).toBe('discard');
        });

        it('play cards in any order', function () {
            this.player1.useAction(this.cauldron, true);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.useAction(this.cauldron, true);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.useAction(this.cauldron, true);
            this.player1.clickCard(this.smith);
            this.player1.clickCard(this.witchOfTheEye);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(2);
        });

        it('trigger Near-Future Lens message', function () {
            this.player1.useAction(this.cauldron, true);
            expect(this).toHaveRecentChatMessage(
                'player1 uses Near-Future Lens to reveal Ganger Chieftain'
            );
        });
    });
});
