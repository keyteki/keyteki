describe('CH-337A', function () {
    describe('when the tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['bad-penny', 'ch-337a', 'redlock']
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor']
                }
            });
        });

        it('should not give its neighbors elusive', function () {
            expect(this.badPenny.getKeywordValue('elusive')).toBe(0);
            expect(this.ch337a.getKeywordValue('elusive')).toBe(1);
            expect(this.redlock.getKeywordValue('elusive')).toBe(0);
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not give its neighbors elusive', function () {
                expect(this.badPenny.getKeywordValue('elusive')).toBe(0);
                expect(this.ch337a.getKeywordValue('elusive')).toBe(1);
                expect(this.redlock.getKeywordValue('elusive')).toBe(0);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should give its neighbors elusive', function () {
                expect(this.badPenny.getKeywordValue('elusive')).toBe(1);
                expect(this.ch337a.getKeywordValue('elusive')).toBe(1);
                expect(this.redlock.getKeywordValue('elusive')).toBe(1);
            });
        });
    });
});
