describe('bull-wark', function () {
    describe("Bull-wark's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['dust-imp', 'bull-wark', 'munchling']
                },
                player2: {
                    inPlay: ['batdrone', 'bot-bookton']
                }
            });
        });

        it('should give its neighbors assault 2', function () {
            expect(this.dustImp.getKeywordValue('assault')).toBe(2);
            expect(this.munchling.getKeywordValue('assault')).toBe(2);
        });
    });
});
