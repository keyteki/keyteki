describe('Lithomancy', function () {
    describe("Lithomancy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['lithomancy'],
                    discard: ['dust-pixie', 'krump']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should gain 2 amber when top card matches active house', function () {
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.useAction(this.lithomancy);
            expect(this.player1.amber).toBe(2);
            expect(this.dustPixie.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not gain amber when top card does not match active house', function () {
            this.player1.moveCard(this.krump, 'deck');
            this.player1.useAction(this.lithomancy);
            expect(this.player1.amber).toBe(0);
            expect(this.krump.location).toBe('deck');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
