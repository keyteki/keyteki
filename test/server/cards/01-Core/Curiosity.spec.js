describe('Curiosity', function () {
    describe("Curiosity's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['curiosity'],
                    inPlay: ['blypyp', 'krump']
                },
                player2: {
                    inPlay: ['mother', 'dodger']
                }
            });
        });

        it('should destroy only scientists', function () {
            this.player1.play(this.curiosity);
            expect(this.blypyp.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
            expect(this.mother.location).toBe('discard');
            expect(this.dodger.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
