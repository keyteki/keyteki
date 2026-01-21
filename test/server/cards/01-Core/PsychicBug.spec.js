describe('Psychic Bug', function () {
    describe("Psychic Bug's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['psychic-bug'],
                    inPlay: ['collector-worm']
                },
                player2: {
                    hand: ['batdrone', 'mother']
                }
            });
        });

        it('should reveal opponent hand on play', function () {
            this.player1.play(this.psychicBug);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should reveal opponent hand on reap', function () {
            this.psychicBug.exhausted = false;
            this.player1.moveCard(this.psychicBug, 'play area');
            this.player1.reap(this.psychicBug);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
