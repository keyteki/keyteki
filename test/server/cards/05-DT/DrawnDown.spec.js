describe('Drawn Down', function () {
    describe("Drawn Down's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['drawn-down', 'timetraveller', 'bot-bookton'],
                    inPlay: []
                },
                player2: {
                    amber: 1,
                    hand: ['gub', 'krump', 'dust-pixie'],
                    inPlay: []
                }
            });

            this.player2.moveCard(this.gub, 'deck');
            this.player2.moveCard(this.krump, 'deck');
            this.player2.moveCard(this.dustPixie, 'deck');
        });

        it('should not prompt for cards if deck is empty', function () {
            this.player2.player.deck = [];
            this.player1.play(this.drawnDown);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should prompt for a single card if deck has only 1 card', function () {
            this.player2.player.deck = [this.gub];
            this.player1.play(this.drawnDown);
            expect(this.player1).toHavePromptCardButton(this.gub);
            this.player1.clickPrompt('gub');
            expect(this.gub.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should prompt to discard one and move one to the bottom', function () {
            this.player1.play(this.drawnDown);

            // the discard prompt
            expect(this.player1).toHavePromptCardButton(this.gub);
            expect(this.player1).toHavePromptCardButton(this.krump);
            expect(this.player1).toHavePromptCardButton(this.dustPixie);
            this.player1.clickPrompt(this.gub.name);

            // the move to bottom prompt
            expect(this.player1).toHavePromptCardButton(this.krump);
            expect(this.player1).toHavePromptCardButton(this.dustPixie);
            this.player1.clickPrompt(this.krump.name);

            this.player1.endTurn();

            expect(this.gub.location).toBe('discard');
            expect(this.krump.location).toBe('deck');
            expect(this.dustPixie.location).toBe('deck');

            expect(this.player2.deck[0]).toBe(this.dustPixie);
            expect(this.player2.deck[this.player2.deck.length - 1]).toBe(this.krump);
        });
    });
});
