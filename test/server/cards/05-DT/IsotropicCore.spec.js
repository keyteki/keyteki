describe('Isotropic Core', function () {
    describe("Armsmaster Molina's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['sanitation-engineer', 'archimedes', 'dextre', 'isotropic-core']
                },
                player2: {
                    inPlay: ['umbra', 'redlock', 'bad-penny']
                }
            });
        });

        it('should give friendly creatures hazardous:1', function () {
            expect(this.sanitationEngineer.getKeywordValue('hazardous')).toBe(2);
            expect(this.archimedes.getKeywordValue('hazardous')).toBe(1);
            expect(this.dextre.getKeywordValue('hazardous')).toBe(1);
            expect(this.umbra.getKeywordValue('hazardous')).toBe(0);
            expect(this.badPenny.getKeywordValue('hazardous')).toBe(0);
            expect(this.redlock.getKeywordValue('hazardous')).toBe(0);
        });
    });
});
