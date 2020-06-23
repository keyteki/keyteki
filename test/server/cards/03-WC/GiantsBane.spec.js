describe("Giant's Bane", function () {
    describe("Giant's Bane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    hand: ['giants--bane'],
                    inPlay: ['drummernaut']
                },
                player2: {
                    amber: 4,
                    inPlay: ['brammo', 'dust-pixie']
                }
            });
        });
        it('prompt for a giant creature to destroy', function () {
            this.player1.play(this.giantsBane);
            expect(this.player1).toHavePrompt('Giants’ Bane');
            expect(this.player1).toBeAbleToSelect(this.brammo);
            expect(this.player1).toBeAbleToSelect(this.drummernaut);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.brammo);
            expect(this.brammo.location).toBe('discard');
        });
    });
});
