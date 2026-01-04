describe('Ruination', function () {
    describe("Ruination's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['troll', 'dust-pixie', 'gauntlet-of-command'],
                    hand: ['ruination', 'painmail']
                },
                player2: {
                    inPlay: ['troll', 'dust-pixie', 'bumpsy', 'gauntlet-of-command']
                }
            });

            this.troll2 = this.player2.player.creaturesInPlay[0];
            this.dustPixie2 = this.player2.player.creaturesInPlay[1];
            this.gauntletOfCommand2 = this.player2.player.cardsInPlay[3];
            this.player1.playUpgrade(this.painmail, this.bumpsy);
        });

        it('should destroy each creature with that name', function () {
            this.player1.play(this.ruination);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player1).toBeAbleToSelect(this.painmail);
            expect(this.player1).toBeAbleToSelect(this.troll2);
            expect(this.player1).toBeAbleToSelect(this.dustPixie2);
            expect(this.player1).toBeAbleToSelect(this.gauntletOfCommand2);
            this.player1.clickCard(this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this.troll.location).toBe('discard');
            expect(this.troll2.location).toBe('discard');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.dustPixie2.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.upgrades).toContain(this.painmail);
            expect(this.gauntletOfCommand.location).toBe('play area');
            expect(this.gauntletOfCommand2.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work with artifacts', function () {
            this.player1.play(this.ruination);
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.gauntletOfCommand.location).toBe('discard');
            expect(this.gauntletOfCommand2.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.troll2.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.dustPixie2.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.bumpsy.upgrades).toContain(this.painmail);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work with upgrades', function () {
            this.player1.play(this.ruination);
            this.player1.clickCard(this.painmail);
            expect(this.painmail.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
