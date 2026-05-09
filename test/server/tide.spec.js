describe('The Tide', function () {
    describe('when a player has a Dark Tidings deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { house: 'untamed' },
                player2: {}
            });
        });

        it("can be raised even if it's high for the active player", function () {
            this.player1.raiseTide();
            this.player1.raiseTide();
            expect(this.player1.chains).toBe(6);
        });
    });

    describe('when neither player has a Dark Tidings deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: { house: 'untamed' },
                player2: {}
            });
        });

        it.skip('the tide cannot be raised', function () {
            this.player1.raiseTide();
            expect(this.player1.isTideHigh()).toBe(false);
        });
    });
});
