describe('Dendrix', function () {
    describe("Dendrix's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dendrix']
                },
                player2: {
                    hand: ['mind-barb'],
                    inPlay: ['dust-imp']
                }
            });
        });

        it('should cause opponent to discard a random card on fight', function () {
            this.player1.fightWith(this.dendrix, this.dustImp);
            expect(this.mindBarb.location).toBe('discard');
        });
    });
});
