describe('Biome Discovery', function () {
    describe("Biome Discovery's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['umbra'],
                    hand: ['biome-discovery', 'troll', 'umbra', 'krump']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra']
                }
            });
        });

        it('should opt to not look at the top 2 cards of the deck', function () {
            this.player1.raiseTide();
            expect(this.player1.isTideHigh()).toBe(true);
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.umbra, 'deck');
            this.player1.play(this.biomeDiscovery);
            expect(this.player1).toHavePrompt('Do you wish to look at the top 2 deck cards?');
            this.player1.clickPrompt('No');
            expect(this.player1).not.toHavePrompt('Choose a card to discard');
            this.player1.endTurn();
        });

        it('should prompt and force card to discard one of 2 cards from top of deck', function () {
            this.player1.raiseTide();
            expect(this.player1.isTideHigh()).toBe(true);

            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.umbra, 'deck');
            this.player1.play(this.biomeDiscovery);
            expect(this.player1).toHavePrompt('Do you wish to look at the top 2 deck cards?');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Choose a card to discard');
            expect(this.player1).toHavePromptCardButton(this.troll);
            expect(this.player1).toHavePromptCardButton(this.umbra);
            expect(this.player1).not.toHavePromptCardButton(this.krump);
            this.player1.clickPrompt('troll');
            expect(this.troll.location).toBe('discard');
            expect(this.umbra.location).toBe('deck');
            expect(this.krump.location).toBe('deck');
        });

        it('should not prompt if no cards in deck', function () {
            this.player1.raiseTide();
            this.player1.player.deck = [];
            this.player1.play(this.biomeDiscovery);
            expect(this.player1).not.toHavePrompt('Do you wish to look at the top 2 deck cards?');
            this.player1.endTurn();
        });

        it('should prompt if 1 card in deck', function () {
            this.player1.raiseTide();
            this.player1.player.deck = [];
            this.player1.moveCard(this.krump, 'deck');
            this.player1.play(this.biomeDiscovery);
            expect(this.player1).toHavePrompt('Do you wish to look at the top 2 deck cards?');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Choose a card to discard');
            expect(this.player1).toHavePromptCardButton(this.krump);
            this.player1.clickPrompt('krump');
            expect(this.krump.location).toBe('discard');
        });

        it('it should raise the tide when it is low', function () {
            this.player1.lowerTide();
            expect(this.player1.isTideHigh()).toBe(false);
            this.player1.play(this.biomeDiscovery);
            expect(this.player1.isTideHigh()).toBe(true);
            this.player1.endTurn();
        });
    });
});
