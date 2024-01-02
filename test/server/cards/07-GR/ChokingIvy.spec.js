describe('Choking Ivy', function () {
    describe("Choking Ivy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['fertility-chant', 'choking-ivy'],
                    inPlay: ['flaxia', 'mab-the-mad'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra', 'krump']
                }
            });
        });

        it('kills creatures from both sides, once when haunted', function () {
            this.player1.play(this.fertilityChant); // get haunted
            this.player1.play(this.chokingIvy);

            expect(this.umbra.location).toBe('discard');
            expect(this.mabTheMad.location).toBe('discard');
            expect(this.flaxia.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
        });

        it('happens once when killing the creatures makes the player haunted', function () {
            this.player1.play(this.chokingIvy);

            expect(this.umbra.location).toBe('discard');
            expect(this.mabTheMad.location).toBe('discard');
            expect(this.flaxia.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
        });

        it('happens twice when not haunted', function () {
            this.player1.reap(this.mabTheMad);
            this.player1.play(this.chokingIvy);

            expect(this.umbra.location).toBe('discard');
            expect(this.mabTheMad.location).toBe('deck');
            expect(this.flaxia.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
        });
    });
});
