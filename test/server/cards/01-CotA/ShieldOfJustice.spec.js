describe('Shield of Justice', function () {
    describe("Shield of Justice's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['shield-of-justice'],
                    inPlay: ['bulwark']
                },
                player2: {
                    inPlay: ['sequis']
                }
            });
        });

        it('should place the creature in archives', function () {
            expect(this.bulwark.hasToken('damage')).toBe(false);
            expect(this.sequis.hasToken('damage')).toBe(false);

            expect(this.bulwark.armor).toBe(2);
            expect(this.bulwark.armorUsed).toBe(0);
            expect(this.bulwark.tokens.armor).toBe(2);

            expect(this.sequis.armor).toBe(2);
            expect(this.sequis.armorUsed).toBe(0);
            expect(this.sequis.tokens.armor).toBe(2);

            this.player1.play(this.shieldOfJustice);

            this.player1.fightWith(this.bulwark, this.sequis);

            expect(this.bulwark.location).toBe('play area');
            expect(this.bulwark.armor).toBe(2);
            expect(this.bulwark.armorUsed).toBe(0);
            expect(this.bulwark.tokens.armor).toBe(2);
            expect(this.bulwark.hasToken('damage')).toBe(false);

            expect(this.sequis.location).toBe('play area');
            expect(this.sequis.armor).toBe(2);
            expect(this.sequis.armorUsed).toBe(2);
            expect(this.sequis.hasToken('armor')).toBe(false);
            expect(this.sequis.tokens.damage).toBe(2);
        });
    });
});
