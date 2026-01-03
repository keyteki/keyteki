describe('Titanarpon', function () {
    describe("Titanarpon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'brobnar',
                    inPlay: ['volax']
                },
                player2: {
                    amber: 3,
                    inPlay: ['thing-from-the-deep']
                }
            });
        });

        it('should double amber on destroy', function () {
            this.player1.fightWith(this.volax, this.thingFromTheDeep);
            expect(this.player1.amber).toBe(10);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
