describe('Causal Loop', function () {
    describe("Causal Loop's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['phase-shift', 'virtuous-works', 'causal-loop']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should archive a card and itself', function () {
            this.player1.play(this.causalLoop);

            expect(this.player1).toBeAbleToSelect(this.virtuousWorks);
            expect(this.player1).toBeAbleToSelect(this.phaseShift);
            this.player1.clickCard(this.virtuousWorks);

            expect(this.virtuousWorks.location).toBe('archives');
            expect(this.causalLoop.location).toBe('archives');
        });

        it("should archive itself if the player's hand is empty", function () {
            this.player1.play(this.phaseShift);
            this.player1.play(this.virtuousWorks);
            this.player1.play(this.causalLoop);

            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.causalLoop.location).toBe('archives');
        });
    });
});
