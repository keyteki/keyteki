describe('Stealth Modifications', function () {
    describe("Stealth Modifications' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['stealth-modifications'],
                    inPlay: [
                        'chuff-ape',
                        'glylyx-weaponsmith',
                        'tyxl-beambuckler',
                        'yxlix-mesmerist',
                        'zorg'
                    ]
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor']
                }
            });
        });

        it('should ward the creature and its neighbors and give them elusive', function () {
            this.player1.playUpgrade(this.stealthModifications, this.tyxlBeambuckler);
            expect(this.chuffApe.getKeywordValue('elusive')).toBe(0);
            expect(this.glylyxWeaponsmith.getKeywordValue('elusive')).toBe(1);
            expect(this.tyxlBeambuckler.getKeywordValue('elusive')).toBe(1);
            expect(this.yxlixMesmerist.getKeywordValue('elusive')).toBe(1);
            expect(this.zorg.getKeywordValue('elusive')).toBe(0);
            expect(this.chuffApe.warded).toBe(false);
            expect(this.glylyxWeaponsmith.warded).toBe(true);
            expect(this.tyxlBeambuckler.warded).toBe(true);
            expect(this.yxlixMesmerist.warded).toBe(true);
            expect(this.zorg.warded).toBe(false);
        });
    });
});
