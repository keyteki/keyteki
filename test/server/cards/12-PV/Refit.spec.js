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
                    inPlay: ['troll', 'brammo', 'gauntlet-of-command'],
                    hand: ['animating-force']
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
            expect(this.player1).isReadyToTakeAction();
        });

        it('should be optional', function () {
            this.player1.play(this.refit);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
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
            expect(this.player2).isReadyToTakeAction();
        });

        it('should work on Animating Force', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('geistoid');
            this.player2.playUpgrade(this.animatingForce, this.gauntletOfCommand);
            this.player2.clickPrompt('Right');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.play(this.refit);
            expect(this.player1).toBeAbleToSelect(this.animatingForce);
            this.player1.clickCard(this.animatingForce);
            this.player1.clickCard(this.brammo);
            expect(this.brammo.upgrades).toContain(this.animatingForce);
            expect(this.player2.player.creaturesInPlay).toContain(this.gauntletOfCommand); // still a creature
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
