describe('Nexus', function () {
    describe("Nexus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['nexus', 'gorm-of-omm', 'library-of-babble']
                },
                player2: {
                    inPlay: ['gauntlet-of-command']
                }
            });
        });

        it("should trigger when reaping, and allow using an opponent's artifact", function () {
            this.player1.reap(this.nexus);
            expect(this.player1).toHavePrompt('Nexus');
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player1).not.toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.player1).toHavePrompt('Gauntlet of Command');
            expect(this.player1).toBeAbleToSelect(this.nexus);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.exhausted).toBe(false);
            expect(this.gauntletOfCommand.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not trigger when there are no artifacts', function () {
            this.player1.clickCard(this.gormOfOmm);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.gormOfOmm.location).toBe('discard');
            expect(this.gauntletOfCommand.location).toBe('discard');
            this.player1.reap(this.nexus);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
