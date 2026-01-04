describe('Mother', function () {
    describe("Mother's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['mother']
                },
                player2: {}
            });
        });

        it("increases the draw size of it's controller by 1", function () {
            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(7);
        });
    });
});
