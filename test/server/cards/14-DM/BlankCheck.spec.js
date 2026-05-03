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
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player2.player.discard.length).toBe(5);
            expect(this.umbra.location).toBe('deck');
            expect(this.dodger.location).toBe('deck');
            expect(this.player1.player.cardsInPlay.length).toBeGreaterThanOrEqual(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets active player choose Opponent to shuffle first', function () {
            this.player1.play(this.blankCheck);
            expect(this.player1).toHavePrompt(
                'Choose which player shuffles their archives and discard pile first'
            );
            this.player1.clickPrompt('Opponent');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player2.player.discard.length).toBe(5);
            expect(this.umbra.location).toBe('deck');
            expect(this.dodger.location).toBe('deck');
            expect(this.player1.player.cardsInPlay.length).toBeGreaterThanOrEqual(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('skips the prompt and assumes player goes first when orderForcedAbilities is disabled', function () {
            this.player1.player.optionSettings.orderForcedAbilities = false;
            this.player1.play(this.blankCheck);
            expect(this.player1).not.toHavePrompt(
                'Choose which player shuffles their archives and discard pile first'
            );
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.player2.player.discard.length).toBe(5);
            expect(this.umbra.location).toBe('deck');
            expect(this.dodger.location).toBe('deck');
            expect(this.player1.player.cardsInPlay.length).toBeGreaterThanOrEqual(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('plays nothing if opponent deck runs out (empty deck and no archives/discard)', function () {
            for (const card of [
                ...this.player2.player.archives,
                ...this.player2.player.deck,
                ...this.player2.player.discard
            ]) {
                this.player2.moveCard(card, 'purged');
            }
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player2.player.deck.length).toBe(0);
            expect(this.player2.player.discard.length).toBe(0);
            this.player1.play(this.blankCheck);
            expect(this.player1).toHavePrompt(
                'Choose which player shuffles their archives and discard pile first'
            );
            this.player1.clickPrompt('Me');
            expect(this.player1.player.cardsInPlay.length).toBe(0);
            expect(this.player2.player.deck.length).toBe(0);
            expect(this.player2.player.discard.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
