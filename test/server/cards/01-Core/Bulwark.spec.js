describe('Bulwark', function () {
    describe("Bulwark's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['dodger', 'bulwark', 'silvertooth']
                },
                player2: {}
            });
        });

        it('should give +2 armor to neighbors', function () {
            expect(this.dodger.armor).toBe(2);
            expect(this.silvertooth.armor).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
