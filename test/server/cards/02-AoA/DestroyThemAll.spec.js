describe('Destroy Them All', function () {
    describe("Destroy Them All's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['batdrone', 'flamethrower'],
                    hand: ['backup-copy']
                },
                player2: {
                    house: 'mars',
                    hand: ['destroy-them-all'],
                    inPlay: ['tunk']
                }
            });
            this.player1.playUpgrade(this.backupCopy, this.batdrone);
            this.player1.endTurn();
            this.player2.clickPrompt('Mars');
        });

        it('should destroy an artifact, a creature, and an upgrade', function () {
            this.player2.play(this.destroyThemAll);

            expect(this.player2).toBeAbleToSelect(this.flamethrower);
            this.player2.clickCard(this.flamethrower);

            expect(this.player2).toBeAbleToSelect(this.tunk);
            expect(this.player2).toBeAbleToSelect(this.batdrone);
            this.player2.clickCard(this.tunk);

            expect(this.player2).toBeAbleToSelect(this.backupCopy);
            this.player2.clickCard(this.backupCopy);

            expect(this.batdrone.location).toBe('play area');
            expect(this.flamethrower.location).toBe('discard');
            expect(this.backupCopy.location).toBe('discard');
            expect(this.tunk.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should destroy an artifact, a creature, and an upgrade simultaneously', function () {
            this.player2.play(this.destroyThemAll);
            this.player2.clickCard(this.flamethrower);
            this.player2.clickCard(this.batdrone);
            this.player2.clickCard(this.backupCopy);
            expect(this.batdrone.location).toBe('deck');
            expect(this.flamethrower.location).toBe('discard');
            expect(this.backupCopy.location).toBe('discard');
            expect(this.tunk.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
