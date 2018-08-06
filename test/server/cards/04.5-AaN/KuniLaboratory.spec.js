describe('Kuni Laboratory', function() {
    integration(function() {
        describe('Kuni Laboratory\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 10,
                        inPlay: ['bayushi-shoju']
                    },
                    player2: {
                        fate: 4,
                        honor: 10,
                        inPlay: ['borderlands-defender', 'third-tower-guard'],
                        hand: ['hiruma-ambusher'],
                        dynastyDeck: ['kuni-laboratory']
                    }
                });

                this.bayushiShoju = this.player1.findCardByName('bayushi-shoju');

                this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');
                this.thirdTowerGuard = this.player2.findCardByName('third-tower-guard');
                this.kuniLaboratory = this.player2.placeCardInProvince('kuni-laboratory', 'province 1');

                // select bid for both players
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('should trigger at the start of the conflict phase', function() {
                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');

                // ensure controlling player loses an honor
                expect(this.player2.honor).toBe(9);

                // ensure the opponent does not lose an honor
                expect(this.player1.honor).toBe(10);
            });

            it('should give +1/+1 to all of the controllers characters in play', function() {

                // progress to conflict phase
                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');

                // pass pre-conflict action window for both players.
                this.noMoreActions();

                // initiate conflict
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiShoju],
                    defenders: [this.borderlandsDefender, this.thirdTowerGuard]
                });

                // test card abilities have taken effect
                expect(this.borderlandsDefender.getMilitarySkill()).toBe(this.borderlandsDefender.getBaseMilitarySkill() + 1);
                expect(this.borderlandsDefender.getPoliticalSkill()).toBe(this.borderlandsDefender.getBasePoliticalSkill() + 1);
                expect(this.thirdTowerGuard.getMilitarySkill()).toBe(this.thirdTowerGuard.getBaseMilitarySkill() + 1);
                expect(this.thirdTowerGuard.getPoliticalSkill()).toBe(this.thirdTowerGuard.getBasePoliticalSkill() + 1);
            });

            it('should give +1/+1 to the controllers character when it is played from hand', function() {

                // progress to conflict phase
                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');

                // pass pre-conflict action window for both players.
                this.noMoreActions();

                // initiate conflict
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiShoju],
                    defenders: []
                });

                // play a character from hand into conflict
                this.hirumaAmbusher = this.player2.playCharacterFromHand('hiruma-ambusher');
                expect(this.player2).toHavePrompt('Where do you wish to play this character?');
                this.player2.clickPrompt('Conflict');

                // test card abilities have taken effect
                expect(this.hirumaAmbusher.getMilitarySkill()).toBe(this.hirumaAmbusher.getBaseMilitarySkill() + 1);
                expect(this.hirumaAmbusher.getPoliticalSkill()).toBe(this.hirumaAmbusher.getBasePoliticalSkill() + 1);
            });

            it('should not give +1/+1 to the opponents characters in play', function() {

                // progress to conflict phase
                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');

                // pass pre-conflict action window for both players.
                this.noMoreActions();

                // initiate conflict
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiShoju],
                    defenders: []
                });

                // test card abilities have not taken effect
                expect(this.bayushiShoju.getMilitarySkill()).not.toBe(this.bayushiShoju.getBaseMilitarySkill() + 1);
                expect(this.bayushiShoju.getPoliticalSkill()).not.toBe(this.bayushiShoju.getBasePoliticalSkill() + 1);
                expect(this.bayushiShoju.getMilitarySkill()).toBe(this.bayushiShoju.getBaseMilitarySkill());
                expect(this.bayushiShoju.getPoliticalSkill()).toBe(this.bayushiShoju.getBasePoliticalSkill());
            });
        });
    });
});
