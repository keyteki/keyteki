describe('Sacred Sanctuary', function() {
    integration(function() {
        describe('Sacred Sanctuary\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-yaruma'],
                        hand: ['for-shame']
                    },
                    player2: {
                        provinces: ['sacred-sanctuary'],
                        inPlay: ['togashi-kazue', 'niten-adept'],
                        hand: ['high-kick', 'tattooed-wanderer']
                    }
                });
                this.yaruma = this.player1.findCardByName('kitsuki-yaruma');
                this.for_shame = this.player1.findCardByName('for-shame');
                this.kazue = this.player2.findCardByName('togashi-kazue');
                this.adept = this.player2.findCardByName('niten-adept');
                this.sanctuary = this.player2.findCardByName('sacred-sanctuary');
                this.high_kick = this.player2.findCardByName('high-kick');
                this.wanderer = this.player2.findCardByName('tattooed-wanderer');
                this.kazue.bow();
                this.player1.pass();
                this.player2.clickCard(this.wanderer);
                this.player2.clickPrompt('Play Tattooed Wanderer as an attachment');
                this.player2.clickCard(this.kazue);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yaruma]
                });
            });

            it('should trigger when attackers are declared and there is a monk in play', function() {
                expect(this.player2).toBeAbleToSelect(this.sanctuary);
            });

            it('should prompt the player to choose only a monk character', function() {
                this.player2.clickCard(this.sanctuary);
                expect(this.player2).toHavePrompt('Sacred Sanctuary');
                expect(this.player2).toBeAbleToSelect(this.kazue);
                expect(this.player2).not.toBeAbleToSelect(this.adept);
                expect(this.player2).not.toBeAbleToSelect(this.wanderer);
            });

            it('should prevent chosen character from bowing at the end of the conflict', function() {
                this.player2.clickCard(this.sanctuary);
                this.player2.clickCard(this.kazue);
                this.player2.clickCard(this.kazue);
                this.player2.clickPrompt('Done');
                this.noMoreActions();
                expect(this.kazue.bowed).toBe(false);
                expect(this.yaruma.bowed).toBe(true);
            });

            it('should prevent chosen character from being bowed', function() {
                this.player2.clickCard(this.sanctuary);
                this.player2.clickCard(this.kazue);
                this.player2.clickCard(this.kazue);
                this.player2.clickPrompt('Done');
                this.player2.pass();
                this.player1.clickCard(this.for_shame);
                this.player1.clickCard(this.kazue);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.kazue.isDishonored).toBe(true);
                expect(this.kazue.bowed).toBe(false);
            });

            it('should not prevent chosen character from being bowed by own card effects', function() {
                this.player2.clickCard(this.sanctuary);
                this.player2.clickCard(this.kazue);
                this.player2.clickCard(this.kazue);
                this.player2.clickPrompt('Done');
                this.player2.clickCard(this.high_kick);
                expect(this.player2).toBeAbleToSelect(this.yaruma);
                this.player2.clickCard(this.yaruma);
                expect(this.player2).toBeAbleToSelect(this.kazue);
                this.player2.clickCard(this.kazue);
                expect(this.yaruma.bowed).toBe(true);
                expect(this.kazue.bowed).toBe(true);
            });
        });
    });
});
