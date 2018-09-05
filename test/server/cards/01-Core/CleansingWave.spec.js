describe('Cleansing Wave', function() {
    integration(function() {
        describe('Cleansing Wave\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        hand: ['cleansing-wave'],
                        inPlay: ['sequis', 'raiding-knight']
                    },
                    player2: {
                        inPlay: ['snufflegator', 'ancient-bear', 'troll']
                    }
                });
                this.snufflegator.addToken('damage', 2);
                this.ancientBear.addToken('damage', 1);
                this.sequis.addToken('damage', 2);
            });

            it('should heal each creature with damage and gain amber equal to the total number healed', function() {
                this.player1.play(this.cleansingWave);
                expect(this.sequis.tokens.damage).toBe(1);
                expect(this.raidingKnight.hasToken('damage')).toBe(false);
                expect(this.snufflegator.tokens.damage).toBe(1);
                expect(this.ancientBear .hasToken('damage')).toBe(false);
                expect(this.troll.hasToken('damage')).toBe(false);
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(0);
            });
        });
    });
});
