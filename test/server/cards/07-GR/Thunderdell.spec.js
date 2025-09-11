describe('Thunderdell', function () {
    describe("Thunderdell's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['press-gang'],
                    inPlay: ['thunderdell'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['cpo-zytar', 'flaxia', 'culf-the-quiet']
                }
            });
        });

        it('does not have splash attack if not haunted', function () {
            this.player1.fightWith(this.thunderdell, this.flaxia);
            expect(this.cpoZytar.location).toBe('play area');
            expect(this.cpoZytar.tokens.damage).toBe(undefined);
            expect(this.culfTheQuiet.tokens.damage).toBe(undefined);
        });

        it('gains splash attack 5 if haunted', function () {
            this.player1.play(this.pressGang);
            this.player1.fightWith(this.thunderdell, this.flaxia);
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.flaxia.location).toBe('discard');
            expect(this.culfTheQuiet.tokens.damage).toBe(5);
        });
    });
});
