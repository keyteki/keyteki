describe('Nexus', function () {
    describe("Nexus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['nexus', 'gorm-of-omm', 'library-of-babble']
                },
                player2: {
                    inPlay: ['gauntlet-of-command', 'epic-quest']
                }
            });
        });

        it("should trigger when reaping, and allow using an opponent's artifact", function () {
            this.player1.reap(this.nexus);
            expect(this.player1).toHavePrompt('Nexus');
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player1).toBeAbleToSelect(this.epicQuest);
            expect(this.player1).not.toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.player1).toHavePrompt('Gauntlet of Command');
            expect(this.player1).toBeAbleToSelect(this.nexus);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.exhausted).toBe(false);
            expect(this.gauntletOfCommand.exhausted).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it("should trigger when reaping, and allow using an opponent's artifact even if it has no effect", function () {
            this.player1.reap(this.nexus);
            expect(this.player1).toHavePrompt('Nexus');
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player1).toBeAbleToSelect(this.epicQuest);
            expect(this.player1).not.toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
            this.player1.clickCard(this.epicQuest);
            expect(this.epicQuest.exhausted).toBe(true);
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not trigger when there are no artifacts', function () {
            this.player1.moveCard(this.gauntletOfCommand, 'discard');
            this.player1.moveCard(this.epicQuest, 'discard');
            this.player1.reap(this.nexus);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
