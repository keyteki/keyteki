describe('access-denied', function () {
    describe("Access Denied's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['cxo-taber'],
                    hand: ['access-denied']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra']
                }
            });
        });

        it('should apply to a creature', function () {
            this.player1.playUpgrade(this.accessDenied, this.umbra);
            expect(this.umbra.location).toBe('play area');
            expect(this.umbra.upgrades).toContain(this.accessDenied);
        });

        it('creature should not be able to reap', function () {
            this.player1.playUpgrade(this.accessDenied, this.cxoTaber);
            expect(this.cxoTaber.location).toBe('play area');
            expect(this.cxoTaber.upgrades).toContain(this.accessDenied);
            this.player1.clickCard(this.cxoTaber);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
        });
    });
});
