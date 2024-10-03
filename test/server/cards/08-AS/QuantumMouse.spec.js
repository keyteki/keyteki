describe('Quantum Mouse', function () {
    describe("Quantum Mouse's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['quantum-mouse'],
                    hand: ['archimedes', 'daughter']
                },
                player2: {
                    amber: 2
                }
            });

            this.daughter.enhancements = ['amber', 'draw', 'capture'];
        });

        it('should not trigger if no bonus', function () {
            this.player1.play(this.archimedes);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should ask to replace draw icon but not amber or capture', function () {
            // Amber.
            this.player1.play(this.daughter);
            expect(this.player1.amber).toBe(2);

            // Draw.
            expect(this.player1).toHavePrompt('How do you wish to resolve this draw icon?');
            expect(this.player1).toHavePromptButton('draw');
            expect(this.player1).toHavePromptButton('discard');
            this.player1.clickPrompt('discard');
            this.player1.clickCard(this.archimedes);
            expect(this.archimedes.location).toBe('discard');
            expect(this.player1.player.hand.length).toBe(0);

            // Capture
            this.player1.clickCard(this.quantumMouse);
            expect(this.quantumMouse.amber).toBe(1);
            expect(this.player2.amber).toBe(1);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
