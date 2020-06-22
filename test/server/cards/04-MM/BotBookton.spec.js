describe('bot-bookton', function () {
    describe("Bot Bookton's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['wild-wormhole', 'library-access'],
                    inPlay: ['bot-bookton'],
                    discard: ['dextre', 'way-of-the-bear', 'anger', 'gauntlet-of-command']
                },
                player2: {
                    inPlay: ['inka-the-spider']
                }
            });
        });

        it('should play a card on top of the deck', function () {
            this.player1.moveCard(this.dextre, 'deck');
            expect(this.dextre.location).toBe('deck');
            this.player1.reap(this.botBookton);
            expect(this.player1).toHavePrompt('Dextre');
            this.player1.clickPrompt('Right');
            expect(this.dextre.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
