describe('Champion Tabris', function () {
    describe("Champion Tabris's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['champion-tabris']
                },
                player2: {
                    amber: 2,
                    inPlay: ['dodger']
                }
            });
        });

        it('should capture 1 amber after fight', function () {
            this.player1.fightWith(this.championTabris, this.dodger);
            expect(this.championTabris.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
