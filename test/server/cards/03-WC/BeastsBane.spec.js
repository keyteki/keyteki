describe("Beast's Bane", function () {
    describe("Beast's Bane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    hand: ['beasts--bane'],
                    inPlay: ['rotgrub']
                },
                player2: {
                    amber: 4,
                    inPlay: ['code-monkey', 'dust-pixie']
                }
            });
        });
        it('prompt for a beast creature to destroy', function () {
            this.player1.play(this.beastsBane);
            expect(this.player1).toHavePrompt('Beasts’ Bane');
            expect(this.player1).toBeAbleToSelect(this.rotgrub);
            expect(this.player1).toBeAbleToSelect(this.codeMonkey);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.rotgrub);
            expect(this.rotgrub.location).toBe('discard');
        });
    });
});
