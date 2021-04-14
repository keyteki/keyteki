describe('Rustmiser', function () {
    describe("Rustmiser's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: [],
                    inPlay: ['rustmiser']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'the-pale-star', 'library-of-the-damned']
                }
            });
        });

        it('should exhaust enemy artifacts', function () {
            expect(this.thePaleStar.exhausted).toBe(false);
            expect(this.libraryOfTheDamned.exhausted).toBe(false);

            this.player1.reap(this.rustmiser);

            expect(this.thePaleStar.exhausted).toBe(true);
            expect(this.libraryOfTheDamned.exhausted).toBe(true);
        });
    });
});
