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
                    inPlay: ['inka-the-spider', 'lifeward']
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

        it('should allow playing non-creatures when Lifeward is in effect', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.useAction(this.lifeward, true);
            this.player2.endTurn();

            this.player1.clickPrompt('logos');
            this.player1.moveCard(this.wayOfTheBear, 'deck');
            expect(this.wayOfTheBear.location).toBe('deck');
            this.player1.reap(this.botBookton);
            expect(this.player1).toHavePrompt('Way of the Bear');
            expect(this.player1).toBeAbleToSelect(this.botBookton);
            this.player1.clickCard(this.botBookton);
            expect(this.wayOfTheBear.location).toBe('play area');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not allow playing creatures when Lifeward is in effect', function () {
            this.player1.endTurn();

            this.player2.clickPrompt('dis');
            this.player2.useAction(this.lifeward, true);
            this.player2.endTurn();

            this.player1.clickPrompt('logos');
            this.player1.moveCard(this.dextre, 'deck');
            expect(this.dextre.location).toBe('deck');
            this.player1.reap(this.botBookton);
            expect(this.dextre.location).toBe('deck');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
