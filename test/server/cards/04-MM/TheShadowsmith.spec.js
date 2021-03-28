describe('The Shadowsmith', function () {
    describe("The Shadowsmith's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 3,
                    inPlay: ['cephaloist', 'the-shadowsmith']
                },
                player2: {
                    inPlay: ['dextre', 'bull-wark', 'urchin']
                }
            });
        });

        it('should give elusive keyword to all mutant creatures', function () {
            expect(this.cephaloist.getKeywordValue('elusive')).toBe(1);
            expect(this.theShadowsmith.getKeywordValue('elusive')).toBe(1);
            expect(this.dextre.getKeywordValue('elusive')).toBe(0);
            expect(this.bullWark.getKeywordValue('elusive')).toBe(1);
            expect(this.urchin.getKeywordValue('elusive')).toBe(1);
        });
    });
});
