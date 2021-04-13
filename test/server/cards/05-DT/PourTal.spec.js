describe('Pour-tal', function () {
    describe("Pour-tal's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['pour-tal']
                },
                player2: {}
            });
        });

        it('should raise the tide but not be archived if the tide is not high', function () {
            this.player1.play(this.pourTal);
            expect(this.pourTal.location).toBe('discard');
            expect(this.player1.isTideHigh()).toBe(true);
        });
        it('should be archived if the tide is high', function () {
            this.player1.raiseTide();
            this.player1.play(this.pourTal);

            expect(this.pourTal.location).toBe('archives');
            expect(this.player1.isTideHigh()).toBe(true);
        });
    });
});
