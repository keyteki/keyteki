describe('Bad Penny', function () {
    describe("Bad Penny's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    amber: 1,
                    inPlay: ['bad-penny']
                }
            });
        });

        it('should return to hand', function () {
            this.player1.fightWith(this.troll, this.badPenny);
            expect(this.badPenny.location).toBe('hand');
            expect(this.badPenny.moribund).toBe(false);
        });
    });
});
