describe('Refit', function () {
    describe("Refit's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['refit', 'cloaking-dongle', 'blast-shielding'],
                    inPlay: ['ember-imp', 'krump'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    inPlay: ['troll', 'brammo']
                }
            });

            this.player1.playUpgrade(this.cloakingDongle, this.emberImp);
            this.player1.playUpgrade(this.blastShielding, this.troll);
        });

        it('should allow moving an upgrade to another creature', function () {
            this.player1.play(this.refit);
            expect(this.player1).toBeAbleToSelect(this.cloakingDongle);
            expect(this.player1).toBeAbleToSelect(this.blastShielding);
            this.player1.clickCard(this.cloakingDongle);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.brammo);
            this.player1.clickCard(this.troll);
            expect(this.cloakingDongle.parent).toBe(this.troll);
            expect(this.troll.upgrades).toContain(this.cloakingDongle);
            expect(this.cloakingDongle.controller).toBe(this.player1.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be optional', function () {
            this.player1.play(this.refit);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy an upgrade when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.refit);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.brammo);
            expect(this.player2).not.toBeAbleToSelect(this.cloakingDongle);
            expect(this.player2).toBeAbleToSelect(this.blastShielding);
            this.player2.clickCard(this.blastShielding);
            expect(this.blastShielding.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
