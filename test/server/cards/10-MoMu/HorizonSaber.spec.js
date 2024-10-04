describe('Horizon Saber', function () {
    describe("Horizon Saber's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'logos',
                    hand: ['horizon-saber', 'horizon-saber2'],
                    inPlay: ['gub'],
                    discard: ['helper-bot', 'poke']
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra']
                }
            });

            this.player1.moveCard(this.poke, 'deck');
        });

        it('should not be able to play with just part 1', function () {
            this.player1.moveCard(this.horizonSaber2, 'discard');
            this.player1.clickCard(this.horizonSaber);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should not be able to play with just part 2', function () {
            this.player1.moveCard(this.horizonSaber, 'discard');
            this.player1.clickCard(this.horizonSaber2);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 1', function () {
            this.player1.clickCard(this.horizonSaber);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should be able to play with part 2', function () {
            this.player1.clickCard(this.horizonSaber2);
            expect(this.player1).toHavePromptButton('Play this creature');
        });

        it('should search for a card and archive, and shuffle discard into deck, on play', function () {
            let shuffled = [];
            this.player1.player.game.on(
                'onDeckShuffled',
                (event) => (shuffled = shuffled.concat(event.player))
            );
            this.player1.playCreature(this.horizonSaber);
            expect(this.player1).toBeAbleToSelect(this.poke);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.horizonSaber);
            this.player1.clickCard(this.poke);
            this.player1.clickPrompt('Done');
            expect(this.poke.location).toBe('archives');
            expect(this.helperBot.location).toBe('deck');
            expect(shuffled.length).toBe(2);
            expect(shuffled[0]).toBe(this.player1.player);
            expect(shuffled[1]).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should search for a card and archive, and shuffle discard into deck, on reap', function () {
            this.player1.playCreature(this.horizonSaber);
            this.player1.clickCard(this.poke);
            this.player1.clickPrompt('Done');
            this.horizonSaber.exhausted = false;
            let shuffled = [];
            this.player1.player.game.on(
                'onDeckShuffled',
                (event) => (shuffled = shuffled.concat(event.player))
            );
            this.player1.reap(this.horizonSaber);
            expect(this.player1).not.toBeAbleToSelect(this.poke);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.horizonSaber);
            this.player1.clickCard(this.helperBot);
            this.player1.clickPrompt('Done');
            expect(this.poke.location).toBe('archives');
            expect(this.helperBot.location).toBe('archives');
            expect(shuffled.length).toBe(2);
            expect(shuffled[0]).toBe(this.player1.player);
            expect(shuffled[1]).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should search for a card and archive, and shuffle discard into deck, on fight', function () {
            this.player1.playCreature(this.horizonSaber);
            this.player1.clickCard(this.poke);
            this.player1.clickPrompt('Done');
            this.horizonSaber.exhausted = false;
            let shuffled = [];
            this.player1.player.game.on(
                'onDeckShuffled',
                (event) => (shuffled = shuffled.concat(event.player))
            );
            this.player1.fightWith(this.horizonSaber, this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.poke);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.horizonSaber);
            this.player1.clickCard(this.helperBot);
            this.player1.clickPrompt('Done');
            expect(this.poke.location).toBe('archives');
            expect(this.helperBot.location).toBe('archives');
            expect(shuffled.length).toBe(2);
            expect(shuffled[0]).toBe(this.player1.player);
            expect(shuffled[1]).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
