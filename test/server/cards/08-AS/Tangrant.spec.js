describe('Tangrant', function () {
    describe("Tangrant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['tangrant'],
                    hand: ['phase-shift', 'glylyx-weaponsmith', 'ether-spider', 'virtuous-works']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should allow playing a Mars card', function () {
            this.player1.play(this.glylyxWeaponsmith);
            expect(this.glylyxWeaponsmith.location).toBe('play area');
            this.player1.clickCard(this.etherSpider);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should stack with Phase Shift', function () {
            this.player1.play(this.phaseShift);
            this.player1.play(this.virtuousWorks);
            expect(this.virtuousWorks.location).toBe('discard');
            this.player1.play(this.glylyxWeaponsmith);
            expect(this.glylyxWeaponsmith.location).toBe('play area');
            this.player1.clickCard(this.etherSpider);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
