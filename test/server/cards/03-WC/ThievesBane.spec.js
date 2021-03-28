describe("Thieves' Bane", function () {
    describe("Thieves' Bane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    hand: ['thieves--bane'],
                    inPlay: ['a-vinda']
                },
                player2: {
                    amber: 4,
                    inPlay: ['breaker-hill', 'dust-pixie']
                }
            });
        });
        it('prompt for a thief creature to destroy', function () {
            this.player1.play(this.thievesBane);
            expect(this.player1).toHavePrompt('Thieves’ Bane');
            expect(this.player1).toBeAbleToSelect(this.aVinda);
            expect(this.player1).toBeAbleToSelect(this.breakerHill);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.aVinda);
            expect(this.aVinda.location).toBe('discard');
        });
    });
});
