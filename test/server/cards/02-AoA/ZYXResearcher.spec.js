describe('ZYX Researcher', function () {
    describe("ZYX Researcher's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['zyx-researcher'],
                    deck: ['troll'],
                    discard: ['lamindra']
                },
                player2: {}
            });
            this.troll = this.player1.findCardByName('troll', 'deck');
        });

        it('archives the top card of the deck when Deck is chosen', function () {
            const topOfDeck = this.player1.player.deck[0];
            this.player1.play(this.zyxResearcher);
            expect(this.player1).toHavePromptButton('Deck');
            expect(this.player1).toHavePromptButton('Discard pile');
            this.player1.clickPrompt('Deck');
            expect(topOfDeck.location).toBe('archives');
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('archives the top card of the discard pile when Discard pile is chosen', function () {
            const topOfDeck = this.player1.player.deck[0];
            this.player1.play(this.zyxResearcher);
            this.player1.clickPrompt('Discard pile');
            expect(this.lamindra.location).toBe('archives');
            expect(topOfDeck.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('ZYX Researcher with empty zones', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['zyx-researcher']
                },
                player2: {}
            });
        });

        it('can choose Deck when the deck is empty and archives nothing', function () {
            this.player1.player.deck = [];
            this.player1.play(this.zyxResearcher);
            expect(this.player1).toHavePromptButton('Deck');
            expect(this.player1).toHavePromptButton('Discard pile');
            this.player1.clickPrompt('Deck');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can choose Discard pile when the discard pile is empty and archives nothing', function () {
            this.player1.player.discard = [];
            this.player1.play(this.zyxResearcher);
            expect(this.player1).toHavePromptButton('Deck');
            expect(this.player1).toHavePromptButton('Discard pile');
            this.player1.clickPrompt('Discard pile');
            expect(this.player1.player.archives.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
