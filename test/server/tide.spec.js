describe('The Tide', function () {
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
