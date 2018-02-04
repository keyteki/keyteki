describe('Shiba Peacemaker', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shiba-peacemaker'],
                    dynastyDeck: ['shiba-peacemaker'],
                    hand: ['seeker-of-knowledge', 'charge']
                }
            });
            this.shibaPeacemaker1 = this.player1.findCardByName('shiba-peacemaker', 'play area');
            this.shibaPeacemaker2 = this.player1.placeCardInProvince('shiba-peacemaker', 'province 1');
        });

        describe('When Shiba Peacemaker is in play', function() {
            it('should have an active ability restricion', function() {
                expect(this.shibaPeacemaker1.abilityRestrictions.length).toBe(1);
            });

            it('should not be able to participate as an attacker', function() {
                expect(this.shibaPeacemaker1.canParticipateAsAttacker('military')).toBe(false);
                expect(this.shibaPeacemaker1.canParticipateAsAttacker('political')).toBe(false);
            });
        });

        describe('When Shiba Peacemaker is in a province', function() {
            it('should have an active ability restricion', function() {
                expect(this.shibaPeacemaker2.abilityRestrictions.length).toBe(1);
            });

            it('should not be able to participate as an attacker', function() {
                expect(this.shibaPeacemaker2.canParticipateAsAttacker('military')).toBe(false);
                expect(this.shibaPeacemaker2.canParticipateAsAttacker('political')).toBe(false);
            });
        });

        describe('When Shiba Peacemaker is the only card in play', function() {
            it('should skip conflict declaration', function() {
                this.spy = spyOn(this.game, 'addMessage');
                this.noMoreActions();

                expect(this.spy).toHaveBeenCalledWith('{0} passes their conflict opportunity as none of their characters can be declared as an attacker', this.player1.player);
            });
        });

        describe('When another character is in play', function() {
            it('should not allow Shiba Peacemaker to be declared as an attacker', function() {
                this.seekerOfKnowledge = this.player1.playCharacterFromHand('seeker-of-knowledge');
                this.noMoreActions();
                this.initiateConflict();
                this.player1.clickCard(this.shibaPeacemaker1);

                expect(this.game.currentConflict.attackers.length).toBe(0);
                expect(this.shibaPeacemaker1.inConflict).toBe(false);
            });
        });

        describe('During a conflict', function() {
            it('should not allow Shiba Peacemaker to be Charged into the conflict', function() {
                this.seekerOfKnowledge = this.player1.playCharacterFromHand('seeker-of-knowledge');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.seekerOfKnowledge],
                    defenders: []
                });
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('charge');

                expect(this.player1).not.toBeAbleToSelect(this.shibaPeacemaker2);
            });
        });
    });
});
