describe('Witch of the Wilds', function () {
    describe("Witch of the Wilds's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['witch-of-the-wilds'],
                    hand: ['phase-shift', 'ancient-bear', 'snufflegator', 'virtuous-works']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should allow playing a untamed card', function () {
            this.player1.play(this.ancientBear);
            expect(this.ancientBear.location).toBe('play area');
            this.player1.clickCard(this.snufflegator);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should stack with Phase Shift', function () {
            this.player1.play(this.phaseShift);
            this.player1.play(this.virtuousWorks);
            expect(this.virtuousWorks.location).toBe('discard');
            this.player1.play(this.ancientBear);
            expect(this.ancientBear.location).toBe('play area');
            this.player1.clickCard(this.snufflegator);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should have DEF effect on GHI', function () {});
    });
});
