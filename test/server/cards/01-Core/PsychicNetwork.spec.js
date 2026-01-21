describe('Psychic Network', function () {
    describe("Psychic Network's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['psychic-network'],
                    inPlay: ['zorg', 'collector-worm', 'yxili-marauder']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should steal 1 amber for each ready Mars creature', function () {
            this.zorg.exhausted = true;
            this.player1.play(this.psychicNetwork);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should steal 3 amber if all Mars creatures are ready', function () {
            this.player1.play(this.psychicNetwork);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
