fdescribe('Biomatrix Backup', function() {
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

            it('should place the creature in archives', function() {
                this.player1.playUpgrade(this.biomatrixBackup, this.tunk);
                console.log(this.tunk.reactions.map(ability => ability.properties));
                //console.log(this.game.effectEngine.getDebugInfo());
                this.player1.fightWith(this.tunk, this.troll);
                expect(this.tunk.location).toBe('archives');
            });
        });
    });
});
