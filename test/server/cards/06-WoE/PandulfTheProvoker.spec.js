describe('Pandulf the Provoker', function () {
    describe("Pandulf the Provoker's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 1,
                    hand: ['pandulf-the-provoker'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['krump', 'troll']
                }
            });
        });

        it('should enraging an enemy creature on play', function () {
            this.player1.play(this.pandulfTheProvoker);
            expect(this.player1).toHavePrompt('Pandulf the Provoker');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.krump);
            expect(this.krump.enraged).toBe(true);
            expect(this.troll.enraged).toBe(false);
            expect(this.flaxia.enraged).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
