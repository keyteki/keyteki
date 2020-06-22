describe('Mab The Mad', function () {
    describe("Mab The Mad's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['mab-the-mad', 'snufflegator', 'duskwitch'],
                    hand: ['low-dawn', 'dew-faerie']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'grabber-jammer']
                }
            });
        });
        it('should shuffle Mab back into the deck when he reaps', function () {
            this.player1.reap(this.mabTheMad);
            expect(this.player1.amber).toBe(1);
            expect(this.mabTheMad.location).toBe('deck');
        });
    });
});
