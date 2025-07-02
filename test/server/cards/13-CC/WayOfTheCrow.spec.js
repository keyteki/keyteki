describe('Way of the Crow', function () {
    describe("Way of the Crow's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['way-of-the-crow'],
                    inPlay: ['bad-penny', 'umbra']
                },
                player2: {
                    inPlay: ['snufflegator']
                }
            });
        });

        it('should give the attached creature elusive', function () {
            this.player1.playUpgrade(this.wayOfTheCrow, this.umbra);
            expect(this.umbra.getKeywordValue('elusive')).toBe(1);
        });

        it('should not give elusive to other creatures', function () {
            this.player1.playUpgrade(this.wayOfTheCrow, this.umbra);
            expect(this.badPenny.getKeywordValue('elusive')).toBe(0);
            expect(this.snufflegator.getKeywordValue('elusive')).toBe(0);
        });

        it('should remove elusive when upgrade is removed', function () {
            this.player1.playUpgrade(this.wayOfTheCrow, this.umbra);
            expect(this.umbra.getKeywordValue('elusive')).toBe(1);

            this.player1.moveCard(this.wayOfTheCrow, 'discard');
            expect(this.umbra.getKeywordValue('elusive')).toBe(0);
        });
    });
});
