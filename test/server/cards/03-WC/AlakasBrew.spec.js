describe('Alakas Brew', function () {
    describe("Alakas Brew's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ancient-bear', 'troll'],
                    hand: ['alaka-s-brew']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });

        it('should give the selected creature 2 power counters.', function () {
            this.player1.play(this.alakaSBrew);
            expect(this.player1).toHavePrompt('Alaka’s Brew');
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            this.player1.clickCard(this.ancientBear);
            expect(this.ancientBear.tokens.power).toBe(2);
        });
    });
});
