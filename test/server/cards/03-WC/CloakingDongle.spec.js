describe('Cloaking Dongle', function () {
    describe("Cloaking Dongle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['cloaking-dongle'],
                    inPlay: ['bad-penny', 'umbra', 'redlock', 'yantzee-gang']
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor']
                }
            });
        });

        it('should give the creature and its neighbors elusive', function () {
            this.player1.playUpgrade(this.cloakingDongle, this.umbra);
            expect(this.badPenny.getKeywordValue('elusive')).toBe(1);
            expect(this.umbra.getKeywordValue('elusive')).toBe(1);
            expect(this.redlock.getKeywordValue('elusive')).toBe(1);
            expect(this.yantzeeGang.getKeywordValue('elusive')).toBe(0);
        });
    });
});
