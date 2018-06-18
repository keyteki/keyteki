describe('Akodo Toshiro', function() {
    integration(function() {
        describe('Akodo Toshiro/Kitsu Spiritcaller interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsu-spiritcaller'],
                        dynastyDiscard: ['akodo-toshiro']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['kitsu-spiritcaller'],
                    defenders: []
                });
                this.player1.player.optionSettings.orderForcedAbilities = true;
                this.player2.pass();
                this.kitsuSpiritcaller = this.player1.clickCard('kitsu-spiritcaller');
                this.akodoToshiro = this.player1.clickCard('akodo-toshiro');
                this.player2.pass();
                this.player1.clickCard(this.akodoToshiro);
            });

            it('should bring Toshiro into play', function() {
                expect(this.akodoToshiro.location).toBe('play area');
            });

            it('should buff Toshiro', function() {
                expect(this.game.currentConflict.attackerSkill).toBe(7);
            });

            it('should not break the province', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Air Ring');
            });

            it('should prompt the player which effect to resolve at the end of the conflict', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Order Simultaneous effects');
            });

            it('should send the character to the discard pile if Toshiro\'s effect is resolved first', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                this.player1.clickPrompt('Akodo Toshiro\'s effect on Akodo Toshiro');
                expect(this.akodoToshiro.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should send the character to the bottom of the dynasty deck if Toshiro\'s effect is resolved first', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Don\'t resolve');
                this.player1.clickPrompt('Kitsu Spiritcaller\'s effect on Akodo Toshiro');
                expect(this.player1.player.dynastyDeck.last()).toBe(this.akodoToshiro);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
