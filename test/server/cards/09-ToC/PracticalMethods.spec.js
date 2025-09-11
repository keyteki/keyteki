describe('Practical Methods', function () {
    describe("Practical Methods's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    token: 'alpha-gamma',
                    inPlay: ['gub'],
                    hand: ['practical-methods'],
                    deck: new Array(12).fill('toad')
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll', 'krump']
                }
            });

            this.alphaGamma1 = this.player1.player.deck[0];
        });

        it('should make a token creature on play', function () {
            this.player1.play(this.practicalMethods);
            this.player1.clickPrompt('Left');
            expect(this.alphaGamma1.location).toBe('play area');
        });

        it('should destroy a friendly and an enemy creature', function () {
            this.player1.play(this.practicalMethods);
            this.player1.clickPrompt('Left');
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.alphaGamma1);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.alphaGamma1);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.gub.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
