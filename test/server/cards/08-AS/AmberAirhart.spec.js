describe('Amber Airhart', function () {
    describe("Amber Airhart's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'skyborn',
                    inPlay: ['æmber-airhart']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should shuffle itself into deck on reap', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.reap(this.æmberAirhart);
            expect(shuffled).toBe(this.player1.player);
            expect(this.æmberAirhart.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should shuffle itself into deck on fight', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.fightWith(this.æmberAirhart, this.lamindra);
            expect(shuffled).toBe(this.player1.player);
            expect(this.æmberAirhart.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
