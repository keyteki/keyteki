describe("Humans' Bane", function () {
    describe("Humans' Bane's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    hand: ['humans--bane'],
                    inPlay: ['manchego']
                },
                player2: {
                    amber: 4,
                    inPlay: ['chief-engineer-walls', 'dust-pixie']
                }
            });
        });
        it('prompt for a human creature to destroy', function () {
            this.player1.play(this.humansBane);
            expect(this.player1).toHavePrompt('Humans’ Bane');
            expect(this.player1).toBeAbleToSelect(this.manchego);
            expect(this.player1).toBeAbleToSelect(this.chiefEngineerWalls);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.manchego);
            expect(this.manchego.location).toBe('discard');
        });
    });
});
