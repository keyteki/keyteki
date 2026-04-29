describe('Researcher', function () {
    describe("Researcher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    token: 'researcher',
                    hand: ['blypyp', 'toad', 'kaboom'],
                    inPlay: ['researcher:pelf']
                }
            });
        });

        it('should archive a revealed mars card', function () {
            this.player1.useOmni(this.researcher);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.kaboom);
            expect(this.player1).not.toBeAbleToSelect(this.toad);
            this.player1.clickCard(this.blypyp);
            expect(this.blypyp.location).toBe('archives');
        });
    });
});
