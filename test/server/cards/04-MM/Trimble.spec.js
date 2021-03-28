describe('Trimble', function () {
    describe("Trimble's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 3,
                    inPlay: ['cephaloist', 'trimble']
                },
                player2: {
                    inPlay: ['dextre', 'bull-wark', 'urchin']
                }
            });
        });

        it('should give skirmish keyword to all mutant creatures', function () {
            expect(this.cephaloist.getKeywordValue('skirmish')).toBe(1);
            expect(this.trimble.getKeywordValue('skirmish')).toBe(1);
            expect(this.dextre.getKeywordValue('skirmish')).toBe(0);
            expect(this.bullWark.getKeywordValue('skirmish')).toBe(1);
            expect(this.urchin.getKeywordValue('skirmish')).toBe(0);
        });
    });
});
