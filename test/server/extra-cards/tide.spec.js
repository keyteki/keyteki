// NOTE: Per the rules, the tide can only be raised/lowered when at least one
// player has a Dark Tidings deck. That is not enforced in the engine because
// it would only affect manual mode / dev shortcuts and properly gating it
// would require tagging existing tests with a tide flag.
describe('The Tide', function () {
    describe('when raised', function () {
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
});
