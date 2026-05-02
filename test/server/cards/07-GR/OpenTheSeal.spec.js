describe('Open the Seal', function () {
    describe("Open the Seal's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['open-the-seal']
                }
            });
        });

        it('plays with no effect', function () {
            this.player1.play(this.openTheSeal);
            expect(this.openTheSeal.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
