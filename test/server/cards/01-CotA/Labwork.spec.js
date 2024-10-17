describe('Labwork', function () {
    describe("Labwork's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['labwork', 'phase-shift', 'virtuous-works']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should archive a card', function () {
            this.player1.play(this.labwork);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Labwork');
            expect(this.player1).toBeAbleToSelect(this.virtuousWorks);
            expect(this.player1).toBeAbleToSelect(this.phaseShift);
            this.player1.clickCard(this.virtuousWorks);
            expect(this.virtuousWorks.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it("should not trigger if the player's hand is empty", function () {
            this.player1.play(this.phaseShift);
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(3);
            this.player1.play(this.labwork);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
