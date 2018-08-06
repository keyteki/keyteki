describe('Raging Battleground', function() {
    integration(function() {
        describe('Raging Battleground\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['hida-tomonatsu', 'crisis-breaker', 'borderlands-defender']
                    },
                    player2: {
                        provinces: ['raging-battleground']
                    }
                });

                this.hidaTomonatsu = this.player1.findCardByName('hida-tomonatsu');
                this.crisisBreaker = this.player1.findCardByName('crisis-breaker');
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');
                this.borderlandsDefender.modifyFate(1);
                this.noMoreActions();
            });

            it('should trigger when the province is revealed', function() {
                this.initiateConflict({
                    attackers: [this.crisisBreaker]
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('raging-battleground');
            });

            it('should allow you to discard a non-unique character without fate', function() {
                this.initiateConflict({
                    attackers: [this.crisisBreaker]
                });
                this.player2.clickCard('raging-battleground');
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect(this.crisisBreaker);
                this.player2.clickCard(this.crisisBreaker);
                expect(this.crisisBreaker.location).toBe('dynasty discard pile');
            });

            it('should not allow you to discard a unique character or a non-unique character with fate', function() {
                this.initiateConflict({
                    attackers: [this.borderlandsDefender, this.hidaTomonatsu]
                });
                this.player2.clickCard('raging-battleground');
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).not.toBeAbleToSelect(this.borderlandsDefender);
                expect(this.player2).not.toBeAbleToSelect(this.hidaTomonatsu);
            });
        });
    });
});
