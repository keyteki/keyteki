describe('Drawn Down', function () {
    describe("Drawn Down's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['drawn-down']
                },
                player2: {
                    hand: ['gub', 'krump', 'dust-pixie', 'flaxia']
                }
            });
        });

        it('should fizzle when opponent deck is empty', function () {
            this.player2.player.deck = [];
            this.player1.play(this.drawnDown);

            expect(this.drawnDown.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should only discard when opponent deck has 1 card', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.gub, 'deck');
            this.player1.play(this.drawnDown);

            expect(this.player1).toHavePromptCardButton(this.gub);
            this.player1.clickPrompt('Gub');

            expect(this.gub.location).toBe('discard');
            expect(this.drawnDown.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard one and move one to bottom when opponent deck has 2 cards', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.gub, 'deck');
            this.player2.moveCard(this.krump, 'deck');
            this.player1.play(this.drawnDown);

            expect(this.player1).toHavePromptCardButton(this.gub);
            expect(this.player1).toHavePromptCardButton(this.krump);
            this.player1.clickPrompt('Gub');
            this.player1.clickPrompt('Krump');

            expect(this.gub.location).toBe('discard');
            expect(this.krump.location).toBe('deck');
            expect(this.player2.deck[this.player2.deck.length - 1]).toBe(this.krump);
            expect(this.drawnDown.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard one, move one to bottom, and leave one on top when opponent deck has 3 cards', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.gub, 'deck');
            this.player2.moveCard(this.krump, 'deck');
            this.player2.moveCard(this.dustPixie, 'deck');
            this.player1.play(this.drawnDown);

            expect(this.player1).toHavePromptCardButton(this.gub);
            expect(this.player1).toHavePromptCardButton(this.krump);
            expect(this.player1).toHavePromptCardButton(this.dustPixie);
            this.player1.clickPrompt('Gub');

            expect(this.player1).toHavePromptCardButton(this.krump);
            expect(this.player1).toHavePromptCardButton(this.dustPixie);
            this.player1.clickPrompt('Krump');

            expect(this.gub.location).toBe('discard');
            expect(this.krump.location).toBe('deck');
            expect(this.player2.deck[this.player2.deck.length - 1]).toBe(this.krump);
            expect(this.dustPixie.location).toBe('deck');
            expect(this.player2.deck[0]).toBe(this.dustPixie);
            expect(this.drawnDown.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should only affect top 3 cards when opponent deck has 4 cards', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.flaxia, 'deck');
            this.player2.moveCard(this.gub, 'deck');
            this.player2.moveCard(this.krump, 'deck');
            this.player2.moveCard(this.dustPixie, 'deck');
            this.player1.play(this.drawnDown);

            expect(this.player1).toHavePromptCardButton(this.gub);
            expect(this.player1).toHavePromptCardButton(this.krump);
            expect(this.player1).toHavePromptCardButton(this.dustPixie);
            expect(this.player1).not.toHavePromptCardButton(this.flaxia);
            this.player1.clickPrompt('Gub');

            expect(this.player1).toHavePromptCardButton(this.krump);
            expect(this.player1).toHavePromptCardButton(this.dustPixie);
            expect(this.player1).not.toHavePromptCardButton(this.flaxia);
            this.player1.clickPrompt('Krump');

            expect(this.gub.location).toBe('discard');
            expect(this.krump.location).toBe('deck');
            expect(this.player2.deck[this.player2.deck.length - 1]).toBe(this.krump);
            expect(this.dustPixie.location).toBe('deck');
            expect(this.player2.deck[0]).toBe(this.dustPixie);
            expect(this.flaxia.location).toBe('deck');
            expect(this.player2.deck[1]).toBe(this.flaxia);
            expect(this.drawnDown.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
