describe('Vulka', function () {
    describe("Vulka's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['vulka', 'alaka', 'lamindra', 'crogg-the-clumsy']
                },
                player2: {
                    inPlay: ['umbra', 'mega-alaka', 'bad-penny']
                }
            });
        });

        it('should give friendly Brobnar creatures splash-attack:1', function () {
            expect(this.vulka.getKeywordValue('splash-attack')).toBe(1);
            expect(this.alaka.getKeywordValue('splash-attack')).toBe(1);
            expect(this.lamindra.getKeywordValue('splash-attack')).toBe(0);
            expect(this.croggTheClumsy.getKeywordValue('splash-attack')).toBe(3);
            expect(this.umbra.getKeywordValue('splash-attack')).toBe(0);
            expect(this.megaAlaka.getKeywordValue('splash-attack')).toBe(0);
            expect(this.badPenny.getKeywordValue('splash-attack')).toBe(0);
        });
    });
});
