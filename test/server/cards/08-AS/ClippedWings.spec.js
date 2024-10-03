describe('Clipped Wings', function () {
    describe("Clipped Wings's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['clipped-wings']
                },
                player2: {
                    hand: ['dust-pixie', 'flaxia'],
                    archives: ['winds-of-death', 'key-abduction']
                }
            });

            this.player1.play(this.clippedWings);
        });

        it('should prompt to purge or shuffle', function () {
            expect(this.player1).toHavePromptButton('Purge');
            expect(this.player1).toHavePromptButton('Shuffle');
        });

        it('should purge a random card from opponent hand', function () {
            this.player1.clickPrompt('Purge');
            expect(this.player2.player.hand.length).toBe(1);
            if (this.dustPixie.location === 'hand') {
                expect(this.flaxia.location).toBe('purged');
            } else {
                expect(this.flaxia.location).toBe('hand');
                expect(this.dustPixie.location).toBe('purged');
            }
            expect(this.player2.player.archives.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should shuffle opponent archives into their deck', function () {
            let shuffled = null;
            this.player2.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));

            this.player1.clickPrompt('Shuffle');
            expect(this.player2.player.hand.length).toBe(2);
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.windsOfDeath.location).toBe('deck');
            expect(this.keyAbduction.location).toBe('deck');
            expect(shuffled).toBe(this.player2.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
