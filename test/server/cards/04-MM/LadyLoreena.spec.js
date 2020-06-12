describe('Lady Loreena', function () {
    integration(function () {
        describe("Lady Loreena's abilities", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: [
                            'grey-monk',
                            'gatekeeper',
                            'bulwark',
                            'lady-loreena',
                            'lamindra',
                            'bull-wark',
                            'francus',
                            'redlock'
                        ],
                        amber: 3
                    },
                    player2: {
                        amber: 2
                    }
                });
            });

            it("should grant taunt to its neighbors' neighbors", function () {
                expect(this.greyMonk.getKeywordValue('taunt')).toBe(0);
                expect(this.gatekeeper.getKeywordValue('taunt')).toBe(1);
                expect(this.bulwark.getKeywordValue('taunt')).toBe(0);
                expect(this.ladyLoreena.getKeywordValue('taunt')).toBe(1);
                expect(this.lamindra.getKeywordValue('taunt')).toBe(0);
                expect(this.bullWark.getKeywordValue('taunt')).toBe(1);
                expect(this.francus.getKeywordValue('taunt')).toBe(0);
                expect(this.redlock.getKeywordValue('taunt')).toBe(0);
            });
        });
    });
});
