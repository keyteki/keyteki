describe('Tangrant', function () {
    describe("Tangrant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['tangrant'],
                    hand: ['phase-shift', 'glylyx-weaponsmith', 'ether-spider', 'virtuous-works']
                },
                player2: {}
            });
        });

        it('should allow playing a Mars card', function () {
            this.player1.play(this.glylyxWeaponsmith);
            expect(this.glylyxWeaponsmith.location).toBe('play area');
            this.player1.clickCard(this.etherSpider);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow playing a house enhanced Mars card', function () {
            this.virtuousWorks.enhancements = ['mars'];
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(3);
            this.player1.clickCard(this.etherSpider);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should stack with Phase Shift', function () {
            this.player1.play(this.phaseShift);
            this.player1.play(this.virtuousWorks);
            expect(this.player1.amber).toBe(3);
            expect(this.virtuousWorks.location).toBe('discard');
            this.player1.play(this.glylyxWeaponsmith);
            expect(this.glylyxWeaponsmith.location).toBe('play area');
            this.player1.clickCard(this.etherSpider);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
