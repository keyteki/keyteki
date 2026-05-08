describe('Gravid Cycle', function () {
    describe("Gravid Cycle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['gravid-cycle', 'dust-pixie'],
                    discard: ['flaxia', 'niffle-ape']
                },
                player2: {}
            });
        });

        it('should return a card from discard pile to hand on play and end turn', function () {
            this.player1.play(this.gravidCycle);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('hand');
            expect(this.niffleApe.location).toBe('discard');
            this.player2.clickPrompt('sanctum');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
