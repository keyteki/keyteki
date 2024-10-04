describe('Gamma Blaster', function () {
    describe("Gamma Blaster's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['glylyx-weaponsmith', 'brash-grabber', 'grabber-jammer'],
                    hand: ['gamma-blaster']
                },
                player2: {
                    inPlay: ['bot-bookton', 'munchling']
                }
            });

            this.brashGrabber.tokens.amber = 1;
            this.grabberJammer.tokens.amber = 1;
            this.botBookton.tokens.amber = 1;
        });

        it('should allow you to destroy enemy creatures with amber on them', function () {
            this.player1.playUpgrade(this.gammaBlaster, this.glylyxWeaponsmith);
            this.player1.reap(this.glylyxWeaponsmith);
            expect(this.player1).toBeAbleToSelect(this.botBookton);
            expect(this.player1).not.toBeAbleToSelect(this.munchling);
            expect(this.player1).not.toBeAbleToSelect(this.brashGrabber);
            expect(this.player1).not.toBeAbleToSelect(this.grabberJammer);
            this.player1.clickCard(this.botBookton);
            expect(this.botBookton.location).toBe('discard');
        });
    });
});
