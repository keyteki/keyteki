describe("Watney's Calculation", function () {
    describe("Watney's Calculation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'mars',
                    hand: ['watney-s-calculation'],
                    inPlay: ['glylyx-weaponsmith']
                },
                player2: {
                    amber: 2,
                    inPlay: ['brikk-nastee', 'vulka']
                }
            });
        });

        it('should allow destroying an enemy creature when opponent has amber', function () {
            this.player1.play(this.watneySCalculation);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.brikkNastee);
            expect(this.player1).toBeAbleToSelect(this.vulka);
            expect(this.player1).not.toBeAbleToSelect(this.glylyxWeaponsmith);
            this.player1.clickCard(this.brikkNastee);
            expect(this.brikkNastee.location).toBe('discard');
        });

        it('should do nothing when opponent does not have more amber', function () {
            this.player1.reap(this.glylyxWeaponsmith);
            this.player1.play(this.watneySCalculation);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
