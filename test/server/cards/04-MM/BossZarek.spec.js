describe('Boss Zarek', function () {
    describe("Boss Zarek's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 3,
                    inPlay: ['flaxia', 'senator-shrix'],
                    hand: ['boss-zarek']
                },
                player2: {
                    inPlay: ['dextre', 'bull-wark', 'urchin']
                }
            });

            this.senatorShrix.tokens.amber = 1;
            this.dextre.tokens.amber = 1;
        });

        it('should give elusive keyword to all friendly creatures with amber', function () {
            expect(this.flaxia.getKeywordValue('elusive')).toBe(0);
            expect(this.senatorShrix.getKeywordValue('elusive')).toBe(0);
            expect(this.dextre.getKeywordValue('elusive')).toBe(0);
            expect(this.bullWark.getKeywordValue('elusive')).toBe(0);
            expect(this.urchin.getKeywordValue('elusive')).toBe(1);
            this.player1.play(this.bossZarek);
            expect(this.bossZarek.getKeywordValue('elusive')).toBe(0);
            expect(this.flaxia.getKeywordValue('elusive')).toBe(0);
            expect(this.senatorShrix.getKeywordValue('elusive')).toBe(1);
            expect(this.dextre.getKeywordValue('elusive')).toBe(0);
            expect(this.bullWark.getKeywordValue('elusive')).toBe(0);
            expect(this.urchin.getKeywordValue('elusive')).toBe(1);
        });
    });
});
