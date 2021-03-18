describe('Grey Augur', function () {
    describe("Grey Augur's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 1,
                    inPlay: ['bulwark', 'grey-augur', 'champion-anaphiel']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra', 'murkens']
                }
            });
        });

        it('fighting with it should not gain 1A', function () {
            this.player1.fightWith(this.greyAugur, this.murkens);
            expect(this.player1.amber).toBe(1);
        });

        it('fighting with its neighbors should gain 1A', function () {
            this.player1.fightWith(this.bulwark, this.lamindra);
            this.player1.fightWith(this.championAnaphiel, this.murkens);
            expect(this.player1.amber).toBe(3);
        });
    });
});
