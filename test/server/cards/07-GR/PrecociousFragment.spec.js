describe('Precocious Fragment', function () {
    describe("Precocious Fragment's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['a-strong-feeling'],
                    inPlay: ['precocious-fragment'],
                    discard: new Array(9).fill('poke').concat(['flaxia']) // not yet haunted
                }
            });
            this.player1.moveCard(this.flaxia, 'deck');
        });

        it('discards the top card of the deck on reap if not haunted', function () {
            this.player1.reap(this.precociousFragment);
            expect(this.player1.amber).toBe(2);
            expect(this.flaxia.location).toBe('discard');
        });

        it('gains 1 amber on reap if haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.reap(this.precociousFragment);
            expect(this.player1.amber).toBe(3);
            expect(this.flaxia.location).toBe('deck');
        });
    });
});
