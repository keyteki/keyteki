describe('ChromaticGuardian', function () {
    describe("Chromatic Guardian's ability", function () {
        it('destroys an enemy creature when overwhelmed', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['chromatic-guardian', 'city-gates']
                },
                player2: {
                    inPlay: ['troll', 'flaxia', 'mack-the-knife', 'gauntlet-of-command']
                }
            });
            this.player1.reap(this.chromaticGuardian);
            expect(this.player1).not.toBeAbleToSelect(this.chromaticGuardian);
            expect(this.player1).not.toBeAbleToSelect(this.cityGates);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.mackTheKnife);
            expect(this.player1).not.toBeAbleToSelect(this.gauntletOfCommand);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.flaxia.location).toBe('play area');
            expect(this.mackTheKnife.location).toBe('play area');
            expect(this.gauntletOfCommand.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys an enemy artifact when not overwhelmed', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['chromatic-guardian', 'city-gates']
                },
                player2: {
                    inPlay: ['troll', 'gauntlet-of-command', 'hallowed-shield']
                }
            });
            this.player1.reap(this.chromaticGuardian);
            expect(this.player1).not.toBeAbleToSelect(this.chromaticGuardian);
            expect(this.player1).not.toBeAbleToSelect(this.cityGates);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player1).toBeAbleToSelect(this.hallowedShield);
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.troll.location).toBe('play area');
            expect(this.gauntletOfCommand.location).toBe('discard');
            expect(this.hallowedShield.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
