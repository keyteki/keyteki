describe('Asako Azunami', function() {
    integration(function() {
        describe('Asako Azunami\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-azunami', 'isawa-kaede', 'shiba-tsukune'],
                        hand: ['seeker-of-knowledge']
                    },
                    player2: {
                        inPlay: ['seppun-guardsman']
                    }
                });
                this.asakoAzunami = this.player1.findCardByName('asako-azunami');
                this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
                this.shibaTsukune.bowed = true;
                this.seppunGuardsman = this.player2.findCardByName('seppun-guardsman');
                this.noMoreActions();
            });

            it('should trigger when the water ring is resolved', function() {
                this.initiateConflict({
                    ring: 'water',
                    attackers: ['asako-azunami'],
                    defenders: []
                });
                this.noMoreActions();
                // Break Province prompt
                this.player1.clickPrompt('No');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.asakoAzunami);
            });

            it('should not trigger when the air ring is resolved', function() {
                this.initiateConflict({
                    attackers: ['asako-azunami'],
                    defenders: []
                });
                this.noMoreActions();
                // Break Province prompt
                this.player1.clickPrompt('No');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should prompt the player to select targets', function() {
                this.initiateConflict({
                    ring: 'water',
                    attackers: ['asako-azunami'],
                    defenders: []
                });
                this.noMoreActions();
                // Break Province prompt
                this.player1.clickPrompt('No');
                this.player1.clickCard(this.asakoAzunami);
                expect(this.player1).toHavePrompt('Choose a character to bow');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                expect(this.player1).toBeAbleToSelect('isawa-kaede');
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.player1).toHavePrompt('Choose a character to ready');
                expect(this.seppunGuardsman.bowed).toBe(false);
                expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
            });

            it('should bow and ready the selected targets', function() {
                this.initiateConflict({
                    ring: 'water',
                    attackers: ['asako-azunami'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.seppunGuardsman.bowed).toBe(false);
                expect(this.shibaTsukune.bowed).toBe(true);
                // Break Province prompt
                this.player1.clickPrompt('No');
                this.player1.clickCard(this.asakoAzunami);
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.seppunGuardsman.bowed).toBe(false);
                this.player1.clickCard(this.shibaTsukune);
                expect(this.seppunGuardsman.bowed).toBe(true);
                expect(this.shibaTsukune.bowed).toBe(false);
            });

            it('should work when multiple rings are being resolved', function() {
                this.player1.player.optionSettings.orderForcedAbilities = true;
                this.initiateConflict({
                    ring: 'water',
                    attackers: ['asako-azunami', 'isawa-kaede'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.playCharacterFromHand('seeker-of-knowledge', 1);
                this.player1.clickPrompt('Conflict');
                this.noMoreActions();
                expect(this.seppunGuardsman.bowed).toBe(false);
                expect(this.shibaTsukune.bowed).toBe(true);
                // Break Province prompt
                this.player1.clickPrompt('No');
                expect(this.player1).toHavePrompt('Resolve Ring Effect');
                this.player1.clickPrompt('Resolve All Elements');
                expect(this.player1).toHavePrompt('Order Simultaneous Effects');
                this.player1.clickPrompt('Air Ring Effect');
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 honor');
                this.player1.clickPrompt('Water Ring Effect');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.asakoAzunami);
                this.player1.clickCard(this.asakoAzunami);
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.seppunGuardsman.bowed).toBe(false);
                this.player1.clickCard(this.shibaTsukune);
                expect(this.seppunGuardsman.bowed).toBe(true);
                expect(this.shibaTsukune.bowed).toBe(false);
            });
        });
    });
});
