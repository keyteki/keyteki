describe('Floomf', function () {
    describe("Floomf's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['ancient-bear', 'troll', 'floomf', 'niffle-queen'],
                    hand: ['alaka-s-brew']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });

        it('should give the selected beast creature 2 power counters.', function () {
            this.player1.fightWith(this.floomf, this.huntingWitch);

            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.niffleQueen);

            this.player1.clickCard(this.niffleQueen);
            expect(this.niffleQueen.tokens.power).toBe(2);
        });
    });
});
