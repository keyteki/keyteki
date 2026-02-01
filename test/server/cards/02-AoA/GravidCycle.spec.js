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

        it('should return a card from discard pile to hand on play', function () {
            this.player1.play(this.gravidCycle);

            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            this.player1.clickCard(this.flaxia);

            expect(this.flaxia.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
