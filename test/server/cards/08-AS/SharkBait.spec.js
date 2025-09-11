describe('Shark Bait', function () {
    describe("Shark Bait's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['glylyx-weaponsmith', 'thunderdell', 'mnemoleech'],
                    hand: ['shark-bait']
                },
                player2: {
                    inPlay: ['brikk-nastee'],
                    amber: 2
                }
            });
        });

        it('can only target friendly non-mars', function () {
            this.player1.play(this.sharkBait);
            expect(this.player1).toBeAbleToSelect(this.thunderdell);
            expect(this.player1).toBeAbleToSelect(this.mnemoleech);
            expect(this.player1).not.toBeAbleToSelect(this.glylyxWeaponsmith);
            expect(this.player1).not.toBeAbleToSelect(this.brikkNastee);
        });

        it('if the creature is destroyed, nothing happens', function () {
            this.player1.play(this.sharkBait);
            this.player1.clickCard(this.mnemoleech);
            expect(this.mnemoleech.location).toBe('discard');
            expect(this.player2.amber).toBe(2);
        });

        it('if the creatures survives, it captures 2', function () {
            this.player1.play(this.sharkBait);
            this.player1.clickCard(this.thunderdell);
            expect(this.thunderdell.location).toBe('play area');
            expect(this.thunderdell.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });
    });
});
