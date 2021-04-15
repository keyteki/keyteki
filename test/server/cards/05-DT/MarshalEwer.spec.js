describe('Marshal Ewer', function () {
    describe("Marshal Ewer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'sanctum',
                    inPlay: ['marshal-ewer']
                },
                player2: {
                    amber: 3,
                    inPlay: ['murkens']
                }
            });
        });

        it('should raise the tide after play', function () {
            expect(this.player1.isTideHigh()).toBe(false);
            this.player1.moveCard(this.marshalEwer, 'hand');
            this.player1.play(this.marshalEwer);
            expect(this.player1.chains).toBe(0);
            expect(this.player1.isTideHigh()).toBe(true);
        });

        it('should raise the tide after fight', function () {
            expect(this.player1.isTideHigh()).toBe(false);
            this.player1.fightWith(this.marshalEwer, this.murkens);
            expect(this.player1.chains).toBe(0);
            expect(this.player1.isTideHigh()).toBe(true);
        });
    });
});
