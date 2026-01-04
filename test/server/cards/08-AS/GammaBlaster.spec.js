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

        it('should allow enemy creatures to target yourself', function () {
            this.player1.playUpgrade(this.gammaBlaster, this.munchling);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.reap(this.munchling);
            expect(this.player2).not.toBeAbleToSelect(this.botBookton);
            expect(this.player2).not.toBeAbleToSelect(this.munchling);
            expect(this.player2).not.toBeAbleToSelect(this.glylyxWeaponsmith);
            expect(this.player2).toBeAbleToSelect(this.brashGrabber);
            expect(this.player2).toBeAbleToSelect(this.grabberJammer);
            this.player2.clickCard(this.brashGrabber);
            expect(this.brashGrabber.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
