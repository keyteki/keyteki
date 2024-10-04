describe('Suggestion Box', function () {
    describe("Suggestion Box's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['suggestion-box'],
                    inPlay: ['iron-heidy'],
                    discard: [
                        'lamindra',
                        'exchange-program',
                        'umbra',
                        'old-bruno',
                        'bad-penny',
                        'swindle'
                    ]
                },
                player2: {
                    amber: 2
                }
            });

            this.player1.moveCard(this.swindle, 'deck');
            this.player1.moveCard(this.lamindra, 'deck');
            this.player1.moveCard(this.exchangeProgram, 'deck');
            this.player1.moveCard(this.umbra, 'deck');
            this.player1.moveCard(this.oldBruno, 'deck');
            this.player1.moveCard(this.badPenny, 'deck');
        });

        it('should look at top 5 cards of deck and add one to hand on reap', function () {
            this.player1.playUpgrade(this.suggestionBox, this.ironHeidy);
            this.player1.reap(this.ironHeidy);
            expect(this.player1).toHavePromptCardButton(this.lamindra);
            expect(this.player1).toHavePromptCardButton(this.exchangeProgram);
            expect(this.player1).toHavePromptCardButton(this.umbra);
            expect(this.player1).toHavePromptCardButton(this.oldBruno);
            expect(this.player1).toHavePromptCardButton(this.badPenny);
            expect(this.player1).not.toHavePromptCardButton(this.swindle);
            this.player1.clickPrompt('exchange program');
            expect(this.exchangeProgram.location).toBe('hand');
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1.player.discard[0]).toBe(this.lamindra);
            expect(this.umbra.location).toBe('discard');
            expect(this.oldBruno.location).toBe('discard');
            expect(this.badPenny.location).toBe('discard');
            expect(this.swindle.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work with only one card in deck', function () {
            this.player1.player.deck = [this.exchangeProgram];
            this.player1.playUpgrade(this.suggestionBox, this.ironHeidy);
            this.player1.reap(this.ironHeidy);
            expect(this.player1).toHavePromptCardButton(this.exchangeProgram);
            this.player1.clickPrompt('exchange program');
            expect(this.exchangeProgram.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
