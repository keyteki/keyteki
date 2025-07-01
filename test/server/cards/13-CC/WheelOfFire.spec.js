describe('Wheel of Fire', function () {
    describe("Wheel of Fire's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['wheel-of-fire'],
                    inPlay: ['bux-bastian']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
        });

        it('should give creature assault 2, hazardous 2, and splash-attack 2', function () {
            this.player1.playUpgrade(this.wheelOfFire, this.buxBastian);
            expect(this.buxBastian.getKeywordValue('assault')).toBe(2);
            expect(this.buxBastian.getKeywordValue('hazardous')).toBe(2);
            expect(this.buxBastian.getKeywordValue('splash-attack')).toBe(2);
        });
    });
});
