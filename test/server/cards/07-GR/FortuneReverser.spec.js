describe('Fortune Reverser', function () {
    describe("Fortune Reverser's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['freelancer', 'insurance-policy', 'niffle-paw', 'fortune-reverser'],
                    inPlay: ['the-old-tinker', 'gemcoat-vendor']
                },
                player2: {
                    hand: ['stealth-mode', 'ethereal-adaptor'],
                    inPlay: ['cpo-zytar'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('destroys other upgrades on play', function () {
            this.player1.playUpgrade(this.freelancer, this.theOldTinker);
            this.player1.playUpgrade(this.insurancePolicy, this.theOldTinker);
            this.player1.playUpgrade(this.nifflePaw, this.gemcoatVendor);
            this.player1.playUpgrade(this.fortuneReverser, this.theOldTinker);
            expect(this.freelancer.location).toBe('discard');
            expect(this.insurancePolicy.location).toBe('discard');
            expect(this.nifflePaw.location).toBe('play area');
            expect(this.fortuneReverser.location).toBe('play area');
            expect(this.theOldTinker.upgrades.length).toBe(1);
            expect(this.theOldTinker.upgrades).toContain(this.fortuneReverser);
        });

        it('blanks creature with the upgrade', function () {
            this.player1.playUpgrade(this.fortuneReverser, this.theOldTinker);
            this.player1.reap(this.theOldTinker);
            expect(this.player1).isReadyToTakeAction();
        });

        it('blanks future "this creature gains" upgrades', function () {
            this.player1.playUpgrade(this.fortuneReverser, this.theOldTinker);
            this.player1.endTurn();
            this.player2.clickPrompt('geistoid');
            this.player2.playUpgrade(this.etherealAdaptor, this.theOldTinker);
            this.theOldTinker.amber = 10;
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not blank enrage tokens', function () {
            this.theOldTinker.enrage();
            this.player1.playUpgrade(this.fortuneReverser, this.theOldTinker);
            this.player1.clickCard(this.theOldTinker);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });
    });
});
