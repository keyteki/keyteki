describe("Demon's Bane", function () {
    describe("Demon's Bane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    hand: ['demons--bane'],
                    inPlay: ['dendrix']
                },
                player2: {
                    amber: 4,
                    inPlay: ['etaromme', 'dust-pixie']
                }
            });
        });
        it('prompt for a demon creature to destroy', function () {
            this.player1.play(this.demonsBane);
            expect(this.player1).toHavePrompt('Demons’ Bane');
            expect(this.player1).toBeAbleToSelect(this.dendrix);
            expect(this.player1).toBeAbleToSelect(this.etaromme);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dendrix);
            expect(this.dendrix.location).toBe('discard');
        });
    });
});
