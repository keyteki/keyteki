describe('Scout Pete', function () {
    describe("Scout Pete's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['krump'],
                    hand: ['scout-pete', 'troll', 'cxo-taber']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra']
                }
            });
        });

        it('should prompt the top card from the deck, and allow player to leave it there', function () {
            this.player1.moveCard(this.troll, 'deck');
            expect(this.player1.deck[0]).toBe(this.troll);
            this.player1.play(this.scoutPete);
            expect(this.player1).toHavePromptCardButton(this.troll);
            expect(this.player1).toHavePromptButton('Leave on top of deck');
            this.player1.clickPrompt('Leave on top of deck');
            expect(this.troll.location).toBe('deck');
        });

        it('should prompt the top cards from the deck and discard it', function () {
            this.player1.moveCard(this.troll, 'deck');
            this.player1.play(this.scoutPete);
            expect(this.player1).toHavePromptCardButton(this.troll);
            expect(this.player1).toHavePromptButton('Leave on top of deck');
            this.player1.clickPrompt('troll');
            expect(this.troll.location).toBe('discard');
        });

        it('should not prompt if no cards in deck', function () {
            this.player1.player.deck = [];
            this.player1.play(this.scoutPete);
            expect(this.player1).not.toHavePromptButton('Leave on top of deck');
        });
    });
});
