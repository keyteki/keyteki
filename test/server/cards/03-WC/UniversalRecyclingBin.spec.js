describe('Universal Recycling Bin', function () {
    describe("Universal Recycling Bin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['eyegor', 'rustgnawer', 'universal-recycle-bin', 'mother'],
                    hand: ['archimedes']
                },
                player2: {
                    amber: 4,
                    hand: ['urchin', 'dextre', 'faygin']
                }
            });
            this.player2.moveCard(this.faygin, 'purged');
            this.player1.moveCard(this.mother, 'purged');
        });

        it('should allow you to move a purged card to your archive', function () {
            expect(this.mother.location).toBe('purged');
            this.player1.clickCard(this.universalRecycleBin);
            expect(this.player1).toHavePromptButton("Use this card's Action ability");
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).not.toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.faygin);
            this.player1.clickCard(this.mother);
            expect(this.mother.location).toBe('archives');
        });
    });
});
