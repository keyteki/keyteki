describe('Asahina Storyteller', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['asahina-storyteller', 'ascetic-visionary', 'asahina-artisan'],
                    hand: ['way-of-the-crane', 'oni-mask', 'seal-of-the-crane']
                }
            });
            this.asahinaStoryteller = this.player1.findCardByName('asahina-storyteller');
            this.asahinaStoryteller.honor();
            this.asahinaStoryteller.modifyFate(1);
            this.asceticVisionary = this.player1.findCardByName('ascetic-visionary');
            this.asceticVisionary.honor();
        });

        describe('Asahina Storyteller\'s constant ability', function() {
            it('should give honored Crane characters sincerity', function() {
                this.player1.clickCard('way-of-the-crane');
                this.asahinaArtisan = this.player1.clickCard('asahina-artisan');
                expect(this.asahinaArtisan.isHonored).toBe(true);
                expect(this.asahinaArtisan.hasSincerity()).toBe(true);
            });

            it('should not give Sincerty to non-Crane characters', function() {
                this.player1.clickCard('way-of-the-crane');
                this.asahinaArtisan = this.player1.clickCard('asahina-artisan');
                expect(this.asceticVisionary.hasSincerity()).toBe(false);
            });

            it('should correctly remove Sincerity when a card loses Crane faction', function() {
                this.player1.playAttachment('oni-mask', this.asahinaStoryteller);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asahinaStoryteller, this.asceticVisionary],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('oni-mask');
                this.player1.clickCard(this.asceticVisionary);
                expect(this.asceticVisionary.isBlank()).toBe(true);
                this.player2.pass();
                this.sealOfTheCrane = this.player1.playAttachment('seal-of-the-crane', this.asceticVisionary);
                expect(this.asceticVisionary.isFaction('crane')).toBe(true);
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Gain 2 Honor');
                expect(this.asceticVisionary.isBlank()).toBe(false);
                expect(this.sealOfTheCrane.location).toBe('conflict discard pile');
                expect(this.asceticVisionary.isFaction('crane')).toBe(false);
                expect(this.asceticVisionary.hasSincerity()).toBe(false);
            });
        });
    });
});
