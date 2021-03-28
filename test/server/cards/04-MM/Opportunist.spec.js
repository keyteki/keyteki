describe('Opportunist', function () {
    describe("Opportunist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 3,
                    inPlay: ['flaxia', 'senator-shrix'],
                    hand: ['opportunist']
                },
                player2: {
                    amber: 2,
                    inPlay: ['dextre', 'bull-wark', 'urchin']
                }
            });
        });

        it('should give elusive keyword to attached creature', function () {
            expect(this.flaxia.getKeywordValue('elusive')).toBe(0);
            expect(this.senatorShrix.getKeywordValue('elusive')).toBe(0);
            expect(this.dextre.getKeywordValue('elusive')).toBe(0);
            expect(this.bullWark.getKeywordValue('elusive')).toBe(0);
            expect(this.urchin.getKeywordValue('elusive')).toBe(1);
            this.player1.playUpgrade(this.opportunist, this.senatorShrix);
            expect(this.flaxia.getKeywordValue('elusive')).toBe(0);
            expect(this.senatorShrix.getKeywordValue('elusive')).toBe(1);
            expect(this.dextre.getKeywordValue('elusive')).toBe(0);
            expect(this.bullWark.getKeywordValue('elusive')).toBe(0);
            expect(this.urchin.getKeywordValue('elusive')).toBe(1);
        });

        it('should capture 1A from opponent', function () {
            expect(this.senatorShrix.amber).toBe(0);
            this.player1.playUpgrade(this.opportunist, this.senatorShrix);
            expect(this.senatorShrix.amber).toBe(1);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
        });

        it('should capture 1A from player when attached to enemy creature', function () {
            expect(this.urchin.amber).toBe(0);
            this.player1.playUpgrade(this.opportunist, this.urchin);
            expect(this.urchin.amber).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
        });
    });
});
