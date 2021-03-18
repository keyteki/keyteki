describe('Submersible', function () {
    describe('when the tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: [
                        'submersible',
                        'bad-penny',
                        'tantadlin',
                        'fidgit',
                        'macis-asp',
                        'urchin'
                    ]
                },
                player2: {
                    inPlay: ['snufflegator', 'silvertooth']
                }
            });
        });

        it('should not give elusive to Thiefs', function () {
            expect(this.badPenny.getKeywordValue('elusive')).toBe(0);
            expect(this.tantadlin.getKeywordValue('elusive')).toBe(0);
            expect(this.fidgit.getKeywordValue('elusive')).toBe(1);
            expect(this.macisAsp.getKeywordValue('elusive')).toBe(0);
            expect(this.urchin.getKeywordValue('elusive')).toBe(1);
            expect(this.snufflegator.getKeywordValue('elusive')).toBe(0);
            expect(this.silvertooth.getKeywordValue('elusive')).toBe(0);
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not give elusive to Thiefs', function () {
                expect(this.badPenny.getKeywordValue('elusive')).toBe(0);
                expect(this.tantadlin.getKeywordValue('elusive')).toBe(0);
                expect(this.fidgit.getKeywordValue('elusive')).toBe(1);
                expect(this.macisAsp.getKeywordValue('elusive')).toBe(0);
                expect(this.urchin.getKeywordValue('elusive')).toBe(1);
                expect(this.snufflegator.getKeywordValue('elusive')).toBe(0);
                expect(this.silvertooth.getKeywordValue('elusive')).toBe(0);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should give elusive to Thiefs', function () {
                expect(this.badPenny.getKeywordValue('elusive')).toBe(1);
                expect(this.tantadlin.getKeywordValue('elusive')).toBe(0);
                expect(this.fidgit.getKeywordValue('elusive')).toBe(2);
                expect(this.macisAsp.getKeywordValue('elusive')).toBe(0);
                expect(this.urchin.getKeywordValue('elusive')).toBe(2);
                expect(this.snufflegator.getKeywordValue('elusive')).toBe(0);
                expect(this.silvertooth.getKeywordValue('elusive')).toBe(0);
            });
        });
    });
});
