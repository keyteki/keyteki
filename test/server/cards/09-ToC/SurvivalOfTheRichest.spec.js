describe('Survival of the Richest', function () {
    describe("Survival of the Richest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'niffle-brute',
                    hand: ['survival-of-the-richest']
                },
                player2: {
                    amber: 1
                }
            });

            this.niffleBrute1 = this.player1.player.deck[0];
        });

        it('should make a token creature on play and not archive if you do not have more amber than opponent', function () {
            this.player1.play(this.survivalOfTheRichest);
            expect(this.niffleBrute1.location).toBe('play area');
            expect(this.survivalOfTheRichest.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make a token creature on play and archive if you have more amber than opponent', function () {
            this.player1.amber = 2;
            this.player1.play(this.survivalOfTheRichest);
            expect(this.niffleBrute1.location).toBe('play area');
            expect(this.survivalOfTheRichest.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
