describe('A Fate Worse Than Death', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-mystic'],
                    hand: ['a-fate-worse-than-death']
                },
                player2: {
                    inPlay: ['steadfast-witch-hunter', 'borderlands-defender'],
                    dynastyDeck: ['young-rumormonger'],
                    hand: ['embrace-the-void', 'ready-for-battle', 'watch-commander']
                }
            });
            this.witchHunter = this.player2.findCardByName('steadfast-witch-hunter');
            this.witchHunter.fate = 1;
            this.defender = this.player2.findCardByName('borderlands-defender');
            this.defender.fate = 1;
            this.noMoreActions();
            this.initiateConflict({
                attackers: ['miya-mystic'],
                defenders: [this.witchHunter, 'borderlands-defender']
            });
        });

        describe('When played, it', function() {
            beforeEach(function() {
                this.player2.moveCard('ready-for-battle', 'conflict discard pile');
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('a-fate-worse-than-death');
                this.player1.clickCard(this.witchHunter);
            });

            it('should dishonor its target', function() {
                expect(this.witchHunter.isDishonored).toBe(true);
            });

            it('should remove fate', function() {
                expect(this.witchHunter.fate).toBe(0);
            });

            it('should send its target home', function() {
                expect(this.witchHunter.inConflict).toBe(false);
            });

            it('should bow its target', function() {
                expect(this.witchHunter.bowed).toBe(true);
            });

            it('should blank its target', function() {
                expect(this.witchHunter.blankCount).toBe(1);
                this.player2.clickCard(this.witchHunter);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should no longer be blanked once the fate phase begins', function() {
                this.noMoreActions();
                this.flow.finishConflictPhase();
                expect(this.game.currentPhase).toBe('fate');
                expect(this.witchHunter.location).toBe('play area');
                expect(this.witchHunter.blankCount).toBe(0);
            });
        });

        describe('Ready For Battle', function() {
            it('should be playable to ready the target', function() {
                this.ready = this.player2.findCardByName('ready-for-battle');
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('a-fate-worse-than-death');
                this.player1.clickCard(this.witchHunter);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.ready);

                this.player2.clickCard(this.ready);
                expect(this.witchHunter.bowed).toBe(false);
            });
        });

        describe('All events', function() {
            it('should share interrupt windows', function() {
                this.rumormonger = this.player2.placeCardInProvince('young-rumormonger', 'province 1');
                this.player2.putIntoPlay(this.rumormonger);
                this.embrace = this.player2.playAttachment('embrace-the-void', this.witchHunter);
                this.player1.clickCard('a-fate-worse-than-death');
                this.player1.clickCard(this.witchHunter);

                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.embrace);
                expect(this.player2).toBeAbleToSelect(this.rumormonger);
            });
        });

        describe('A target who cannot be affected by some of the effets', function() {
            beforeEach(function() {
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('a-fate-worse-than-death');
                this.player1.clickCard(this.defender);
            });

            it('should not be affected by effects which cannot affect them', function() {
                expect(this.defender.bowed).toBe(false);
                expect(this.defender.inConflict).toBe(true);
            });
            
            it('should still be affected by the other effects', function() {
                expect(this.defender.isDishonored).toBe(true);
                expect(this.defender.fate).toBe(0);
                expect(this.defender.blankCount).toBe(1);
            });
        });

        describe('This event', function() {
            beforeEach(function() {
                this.player2.moveCard('ready-for-battle', 'conflict discard pile');
                this.watchCommander = this.player2.playAttachment('watch-commander', this.witchHunter);
                this.player1.clickCard('a-fate-worse-than-death');
                this.player1.clickCard(this.witchHunter);
            });

            it('should not remove Watch Commander when it is played', function() {
                expect(this.witchHunter.attachments.toArray()).toContain(this.watchCommander);
                expect(this.watchCommander.location).toBe('play area');
            });

            it('should not remove Watch Commander when the blank effect ends', function() {
                this.player2.clickPrompt('Pass');
                this.noMoreActions();
                this.flow.finishConflictPhase();
                expect(this.game.currentPhase).toBe('fate');
                expect(this.witchHunter.location).toBe('play area');
                expect(this.witchHunter.attachments.toArray()).toContain(this.watchCommander);
                expect(this.watchCommander.location).toBe('play area');                
            });
        });
    });
});
