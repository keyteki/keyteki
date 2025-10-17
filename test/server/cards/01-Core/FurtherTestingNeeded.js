describe('FurtherTestingNeeded', function () {
    describe("FurtherTestingNeed's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['blypyp', 'commpod'],
                    hand: ['further-testing-needed']
                }
            });
        });
        it('should prompt to choose a card', function () {
            this.player1.play(this.furtherTestingNeeded);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).toBeAbleToSelect(this.commpod);
            this.player1.clickCard(this.commpod);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.archives).toContain(this.commpod);
        });
    });
});
