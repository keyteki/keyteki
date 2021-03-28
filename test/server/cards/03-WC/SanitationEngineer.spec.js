describe('Sanitation Engineer', function () {
    describe("Sanitation Engineer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['sanitation-engineer', 'old-yurk'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        it('should discard a card when used to reap', function () {
            this.player1.reap(this.sanitationEngineer);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Sanitation Engineer');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            this.player1.clickCard(this.soulkeeper);
            expect(this.soulkeeper.location).toBe('discard');
        });
    });
});
