describe('Kitsu Spiritcaller', function() {
    integration(function() {
        describe('Kitsu Spiritcaller\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsu-spiritcaller', 'seppun-guardsman'],
                        dynastyDiscard: ['honored-general'],
                        hand: ['reprieve'],
                        conflictDiscard: ['master-of-the-spear']
                    }
                });
            });

            it('should not work when there is no conflict', function() {
                this.player1.clickCard('kitsu-spiritcaller');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should work when the Spiritcaller is in the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['kitsu-spiritcaller'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('kitsu-spiritcaller');
                expect(this.player1).toHavePrompt('Kitsu Spiritcaller');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: ['seppun-guardsman'],
                        defenders: []
                    });
                    this.player2.pass();
                    this.kitsuSpiritcaller = this.player1.clickCard('kitsu-spiritcaller');
                });

                it('should be a legal play', function() {
                    expect(this.player1).toHavePrompt('Kitsu Spiritcaller');
                });

                it('should bring the target into play in the conflict', function() {
                    this.honoredGeneral = this.player1.clickCard('honored-general');
                    expect(this.honoredGeneral.location).toBe('play area');
                    expect(this.honoredGeneral.inConflict).toBe(true);
                    expect(this.game.currentConflict.attackers).toContain(this.honoredGeneral);
                });

                it('should work on conflict characters', function() {
                    this.masterOfTheSpear = this.player1.clickCard('master-of-the-spear');
                    expect(this.masterOfTheSpear.location).toBe('play area');
                    expect(this.masterOfTheSpear.inConflict).toBe(true);
                    expect(this.game.currentConflict.attackers).toContain(this.masterOfTheSpear);
                });

                it('should bow Kitsu Spiritcaller', function() {
                    this.honoredGeneral = this.player1.clickCard('honored-general');
                    expect(this.kitsuSpiritcaller.bowed).toBe(true);
                });

                it('should trigger on enters play reactions', function() {
                    this.honoredGeneral = this.player1.clickCard('honored-general');
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.honoredGeneral);
                    this.player1.clickCard(this.honoredGeneral);
                    expect(this.honoredGeneral.isHonored).toBe(true);
                });

                it('should return the target to the bottom of the deck at the end of the conflict', function() {
                    this.honoredGeneral = this.player1.clickCard('honored-general');
                    this.player1.clickCard(this.honoredGeneral);
                    this.noMoreActions();
                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Gain 2 honor');
                    expect(this.honoredGeneral.location).toBe('dynasty deck');
                    expect(this.player1.player.dynastyDeck.last()).toBe(this.honoredGeneral);
                });

                it('should allow save abilities to stop it returning to the bottom of the deck', function() {
                    this.honoredGeneral = this.player1.clickCard('honored-general');
                    this.player1.clickCard(this.honoredGeneral);
                    this.player2.pass();
                    this.reprieve = this.player1.playAttachment('reprieve', this.honoredGeneral);
                    this.noMoreActions();
                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Gain 2 honor');
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.reprieve);
                    this.player1.clickCard(this.reprieve);
                    expect(this.honoredGeneral.location).toBe('play area');
                    expect(this.reprieve.location).toBe('conflict discard pile');
                });
            });
        });
    });
});
