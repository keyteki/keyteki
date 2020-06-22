describe("Dinosaurs' Bane", function () {
    describe("Dinosaurs' Bane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    hand: ['dinosaurs--bane'],
                    inPlay: ['legatus-raptor']
                },
                player2: {
                    amber: 4,
                    inPlay: ['odoac-the-patrician', 'dust-pixie']
                }
            });
        });
        it('prompt for a dinosaur creature to destroy', function () {
            this.player1.play(this.dinosaursBane);
            expect(this.player1).toHavePrompt('Dinosaurs’ Bane');
            expect(this.player1).toBeAbleToSelect(this.legatusRaptor);
            expect(this.player1).toBeAbleToSelect(this.odoacThePatrician);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.legatusRaptor);
            expect(this.legatusRaptor.location).toBe('discard');
        });
    });
});
