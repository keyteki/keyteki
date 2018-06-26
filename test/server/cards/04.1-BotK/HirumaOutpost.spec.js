describe('Hiruma Outpose', function() {
    integration(function() {
        describe('Hiruma Outpose\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 12,
                        inPlay: ['matsu-berserker']
                    },
                    player2: {
                        dynastyDeck: ['hiruma-outpost', 'imperial-storehouse']
                    }
                });
                this.hirumaOutpost = this.player2.placeCardInProvince('hiruma-outpost');
                this.imperialStorehouse = this.player2.placeCardInProvince('imperial-storehouse', 'province 2');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
            });

            it('should trigger when an attack is declared against a province without a holding', function() {
                this.player1.pass();
                this.player2.clickCard(this.imperialStorehouse);
                this.noMoreActions();
                this.initiateConflict({
                    province: this.shamefulDisplay,
                    attackers: ['matsu-berserker']
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.hirumaOutpost);
            });

            it('should trigger when an attack is declared against a province with a facedown holding', function() {
                this.imperialStorehouse.facedown = true;
                this.noMoreActions();
                this.initiateConflict({
                    province: this.shamefulDisplay,
                    attackers: ['matsu-berserker']
                });
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.hirumaOutpost);
            });

            it('should not trigger when an attack is declared against a province with a holding', function() {
                this.noMoreActions();
                this.initiateConflict({
                    province: this.shamefulDisplay,
                    attackers: ['matsu-berserker']
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('shouldn\'t trigger when Hiruma Outpost is facedown', function() {
                this.hirumaOutpost.facedown = true;
                this.game.checkGameState(true);
                this.noMoreActions();
                this.initiateConflict({
                    province: this.shamefulDisplay,
                    attackers: ['matsu-berserker']
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('shouldn\'t trigger when Hiruma Outpost is on a broken province', function() {
                this.player2.findCardByName('shameful-display', 'province 1').isBroken = true;
                this.game.checkGameState(true);
                this.noMoreActions();
                this.initiateConflict({
                    province: this.shamefulDisplay,
                    attackers: ['matsu-berserker']
                });
                expect(this.player2).toHavePrompt('Choose defenders');
            });

            it('should make the opponent lose one honor', function() {
                this.player1.pass();
                this.player2.clickCard(this.imperialStorehouse);
                this.noMoreActions();
                this.initiateConflict({
                    province: this.shamefulDisplay,
                    attackers: ['matsu-berserker']
                });
                this.player2.clickCard(this.hirumaOutpost);
                expect(this.player1.honor).toBe(11);
            });
        });
    });
});
