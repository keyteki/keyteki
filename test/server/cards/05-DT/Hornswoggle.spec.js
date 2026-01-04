describe('Hornswoggle', function () {
    describe("Hornswoggle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['murkens', 'gorm-of-omm', 'library-of-babble'],
                    hand: ['hornswoggle']
                },
                player2: {
                    inPlay: ['gauntlet-of-command']
                }
            });

            this.player1.reap(this.murkens);
        });

        it("should trigger when played, and allow using an opponent's artifact", function () {
            this.player1.play(this.hornswoggle);
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player1).not.toBeAbleToSelect(this.gormOfOmm);
            expect(this.player1).not.toBeAbleToSelect(this.libraryOfBabble);
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.player1).toHavePrompt('Gauntlet of Command');
            expect(this.player1).toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.murkens);
            expect(this.murkens.exhausted).toBe(false);
            expect(this.gauntletOfCommand.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not trigger when there are no artifacts', function () {
            this.player1.clickCard(this.gormOfOmm);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.gormOfOmm.location).toBe('discard');
            expect(this.gauntletOfCommand.location).toBe('discard');
            this.player1.play(this.hornswoggle);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
