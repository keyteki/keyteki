describe('The Witching Hour', function () {
    describe("The Witching Hour's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['the-witching-hour'],
                    discard: ['witch-of-the-eye', 'ganger-chieftain', 'dharna']
                }
            });
        });

        it('return witches to hand from discard', function () {
            this.player1.play(this.theWitchingHour);
            expect(this.witchOfTheEye.location).toBe('hand');
            expect(this.dharna.location).toBe('hand');
            expect(this.gangerChieftain.location).toBe('discard');
        });
    });
});
