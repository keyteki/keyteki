describe('Wind Shield', function () {
    describe("Wind Shield's card ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['wind-shield'],
                    inPlay: ['glylyx-weaponsmith', 'thunderdell']
                },
                player2: {
                    amber: 3,
                    inPlay: ['brikk-nastee']
                }
            });
        });

        it('should give elusive and the ability to capture 1A on a friendly creature', function () {
            this.player1.playUpgrade(this.windShield, this.glylyxWeaponsmith);
            this.player1.reap(this.glylyxWeaponsmith);
            expect(this.player1).toBeAbleToSelect(this.glylyxWeaponsmith);
            expect(this.player1).toBeAbleToSelect(this.thunderdell);
            expect(this.player1).not.toBeAbleToSelect(this.brikkNastee);
            this.player1.clickCard(this.thunderdell);
            expect(this.thunderdell.amber).toBe(1);
            expect(this.player2.amber).toBe(2);

            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.brikkNastee, this.glylyxWeaponsmith);
            expect(this.brikkNastee.damage).toBe(0);
        });
    });
});
