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
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.mackTheKnife);
            expect(this.player1).not.toBeAbleToSelect(this.gauntletOfCommand); // enemy artifact
            expect(this.player1).not.toBeAbleToSelect(this.chromaticGuardian); // friendly creature
            expect(this.player1).not.toBeAbleToSelect(this.cityGates); // friendly artifact
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.gauntletOfCommand.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('destroys an enemy artifact when not overwhelmed', function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['chromatic-guardian', 'urchin', 'golden-dagger', 'city-gates']
                },
                player2: {
                    inPlay: ['troll', 'gauntlet-of-command', 'hallowed-shield']
                }
            });
            this.player1.reap(this.chromaticGuardian);
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player1).toBeAbleToSelect(this.hallowedShield);
            expect(this.player1).not.toBeAbleToSelect(this.troll); // enemy creature
            expect(this.player1).not.toBeAbleToSelect(this.urchin); // friendly creature
            expect(this.player1).not.toBeAbleToSelect(this.cityGates); // friendly artifact
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.gauntletOfCommand.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
