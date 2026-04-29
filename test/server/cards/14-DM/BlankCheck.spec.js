describe('Blank Check', function () {
    describe("Blank Check's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['blank-check'],
                    discard: ['umbra'],
                    archives: ['dodger']
                },
                player2: {
                    deck: ['urchin', 'troll', 'bumpsy', 'krump', 'autocannon', 'hobnobber'],
                    discard: ['silvertooth', 'macis-asp'],
                    archives: ['nightmare-urchin']
                }
            });
        });

        it('prompts active player to order who shuffles first, then discards top 5 and plays top card', function () {
            this.player1.play(this.blankCheck);
            expect(this.player1).toHavePrompt(
                'Choose which player shuffles their archives and discard pile first'
            );
            expect(this.player1).toHavePromptButton('Me');
            expect(this.player1).toHavePromptButton('Opponent');
            this.player1.clickPrompt('Me');
            // Opponent's archives and discard moved into deck (then top 5 discarded + 1 played)
            expect(this.player2.player.archives.length).toBe(0);
            // Player1's own archives/discard cleared too
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.umbra.location).toBe('deck');
            expect(this.dodger.location).toBe('deck');
            // Some opponent card got played under player1's control
            expect(this.player1.player.cardsInPlay.length).toBeGreaterThanOrEqual(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets active player choose Opponent to shuffle first', function () {
            this.player1.play(this.blankCheck);
            expect(this.player1).toHavePrompt(
                'Choose which player shuffles their archives and discard pile first'
            );
            this.player1.clickPrompt('Opponent');
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1.player.cardsInPlay.length).toBeGreaterThanOrEqual(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('plays nothing if opponent deck runs out (empty deck and no archives/discard)', function () {
            const opp = this.player2.player;
            // Move every opponent card out of deck/discard/archives so they all end up empty
            const allCards = [...opp.deck, ...opp.discard, ...opp.archives];
            for (const card of allCards) {
                this.player2.moveCard(card, 'purged');
            }
            expect(opp.deck.length).toBe(0);
            this.player1.play(this.blankCheck);
            // Only player1 has cards to shuffle, so still prompted (only Me option fires anything)
            if (
                this.player1.hasPrompt(
                    'Choose which player shuffles their archives and discard pile first'
                )
            ) {
                this.player1.clickPrompt('Me');
            }
            expect(opp.deck.length).toBe(0);
            expect(this.player1.player.cardsInPlay.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
