describe('Biomatrix Backup', function() {
    integration(function() {
        describe('Biomatrix Backup\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'mars',
                        hand: ['biomatrix-backup'],
                        inPlay: ['tunk']
                    },
                    player2: {
                        inPlay: ['troll']
                    }
                });
            });

            it('should allow the active player to place the creature in archives', function() {
                this.player1.playUpgrade(this.biomatrixBackup, this.tunk);
                this.player1.fightWith(this.tunk, this.troll);
                expect(this.tunk.tokens.damage).toBe(7);
                expect(this.troll.tokens.damage).toBe(6);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.tunk);
                this.player1.clickCard(this.tunk);
                expect(this.tunk.location).toBe('archives');
            });

            it('should allow the active player to place the creature in archives', function() {
                this.player1.playUpgrade(this.biomatrixBackup, this.tunk);
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.fightWith(this.troll, this.tunk);
                expect(this.tunk.tokens.damage).toBe(7);
                expect(this.troll.tokens.damage).toBe(6);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.tunk);
                this.player2.clickPrompt('Done');
                expect(this.tunk.location).toBe('discard');
            });
        });
    });
});
