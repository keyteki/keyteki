describe('One-Eye Willa', function () {
    describe('when the tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['bad-penny', 'one-eyed-willa', 'redlock']
                },
                player2: {
                    amber: 3,
                    inPlay: ['snufflegator', 'lamindra']
                }
            });
        });

        it('should not gain elusive', function () {
            expect(this.oneEyedWilla.getKeywordValue('elusive')).toBe(0);
            expect(this.oneEyedWilla.getKeywordValue('skirmish')).toBe(0);
        });

        it('should steal one amber after fight', function () {
            this.player1.fightWith(this.oneEyedWilla, this.lamindra);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not gain elusive', function () {
                expect(this.oneEyedWilla.getKeywordValue('elusive')).toBe(0);
                expect(this.oneEyedWilla.getKeywordValue('skirmish')).toBe(0);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should gain elusive', function () {
                expect(this.oneEyedWilla.getKeywordValue('elusive')).toBe(1);
                expect(this.oneEyedWilla.getKeywordValue('skirmish')).toBe(1);
            });
        });
    });
});
