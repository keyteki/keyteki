describe('Fu Sui Disciple', function() {
    integration(function() {
        describe('Fu Sui Disciple\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['fu-sui-disciple'],
                        hand: ['know-the-world', 'charge'],
                        dynastyDeck: ['marauding-oni']
                    },
                    player2: {
                        inPlay: ['fu-sui-disciple', 'steward-of-law'],
                        hand: ['assassination'],
                        dynastyDeck: ['secluded-shrine']
                    }
                });
                this.maraudingOni = this.player1.placeCardInProvince('marauding-oni');
                this.secludedShrine = this.player2.placeCardInProvince('secluded-shrine');
                this.nextPhase();
                this.player2.clickCard(this.secludedShrine);
                this.player2.clickRing('air');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'void',
                    attackers: ['fu-sui-disciple'],
                    defenders: []
                });
                this.noMoreActions();
                // End of conflict
            });

            it('should prompt to choose a player when the controller is the only one with the air ring', function() {
                this.player1.pass();
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                expect(this.player2).toHavePrompt('Fū Sui Disciple');
                expect(this.player2.currentButtons).toContain('Cancel');
                expect(this.player2.currentButtons).toContain('Me');
                expect(this.player2.currentButtons).not.toContain('My Opponent');
            });

            it('should prompt to choose a player when the controller\'s opponent is the only one with the air ring', function() {
                this.fuSuiDiciple = this.player1.clickCard('fu-sui-disciple');
                expect(this.player1).toHavePrompt('Fū Sui Disciple');
                expect(this.player1.currentButtons).toContain('Cancel');
                expect(this.player1.currentButtons).not.toContain('Me');
                expect(this.player1.currentButtons).toContain('My Opponent');
            });

            it('should prompt to choose a player when both players have the air ring', function() {
                this.player1.clickCard('know-the-world');
                this.player1.clickRing('void');
                this.player1.clickRing('air');
                expect(this.game.rings.air.claimedBy).toBe(this.player1.player.name);
                this.player2.pass();
                this.fuSuiDiciple = this.player1.clickCard('fu-sui-disciple');
                expect(this.player1).toHavePrompt('Fū Sui Disciple');
                expect(this.player1.currentButtons).toContain('Cancel');
                expect(this.player1.currentButtons).toContain('Me');
                expect(this.player1.currentButtons).toContain('My Opponent');
            });

            it('should not allow choosing an honored character', function() {
                this.player1.pass();
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                this.fuSuiDiciple.isHonored = true;
                this.player2.clickPrompt('Me');
                expect(this.player2).toHavePrompt('Fū Sui Disciple');
                expect(this.player2).toBeAbleToSelect('steward-of-law');
                expect(this.player2).not.toBeAbleToSelect(this.fuSuiDiciple);
            });

            it('should not allow choosing a dishonored character', function() {
                this.player1.pass();
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                this.fuSuiDiciple.isDishonored = true;
                this.player2.clickPrompt('Me');
                expect(this.player2).toHavePrompt('Fū Sui Disciple');
                expect(this.player2).toBeAbleToSelect('steward-of-law');
                expect(this.player2).not.toBeAbleToSelect(this.fuSuiDiciple);
            });

            it('should allow the controller to cancel when choosing a character', function() {
                this.player1.pass();
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                this.player2.clickPrompt('Me');
                expect(this.player2).toHavePrompt('Fū Sui Disciple');
                expect(this.player2.currentButtons).toContain('Cancel');
            });

            it('should allow the controller to cancel when choosing an effect for their character', function() {
                this.player1.pass();
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                this.player2.clickPrompt('Me');
                this.player2.clickCard(this.fuSuiDiciple);
                expect(this.player2).toHavePrompt('Fū Sui Disciple');
                expect(this.player2.currentButtons).toContain('Cancel');
                expect(this.player2.currentButtons).toContain('Honor this character');
                expect(this.player2.currentButtons).toContain('Dishonor this character');
            });

            it('should not allow the controller\'s opponent to cancel when choosing a character', function() {
                this.player1.clickCard('know-the-world');
                this.player1.clickRing('void');
                this.player1.clickRing('air');
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                this.player2.clickPrompt('My Opponent');
                expect(this.player1).toHavePrompt('Fū Sui Disciple');
                expect(this.player2.currentButtons).not.toContain('Cancel');
            });

            it('should not allow the controller to cancel when choosing an effect for an opponent\'s character', function() {
                this.player1.clickCard('know-the-world');
                this.player1.clickRing('void');
                this.player1.clickRing('air');
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                this.player2.clickPrompt('My Opponent');
                this.player1.clickCard('fu-sui-disciple');
                expect(this.player2).toHavePrompt('Fū Sui Disciple');
                expect(this.player2.currentButtons).not.toContain('Cancel');
                expect(this.player2.currentButtons).toContain('Honor this character');
                expect(this.player2.currentButtons).toContain('Dishonor this character');
            });

            it('should not allow dishonoring a character that can\'t be dishonored', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['fu-sui-disciple', 'steward-of-law'],
                    defenders: []
                });
                this.player1.pass();
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                this.player2.clickPrompt('Me');
                this.player2.clickCard(this.fuSuiDiciple);
                expect(this.player2.currentButtons).toContain('Honor this character');
                expect(this.player2.currentButtons).not.toContain('Dishonor this character');
            });

            it('should honor the character', function() {
                this.player1.pass();
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                this.player2.clickPrompt('Me');
                this.player2.clickCard(this.fuSuiDiciple);
                this.player2.clickPrompt('Honor this character');
                expect(this.fuSuiDiciple.isHonored).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should dishonor the character', function() {
                this.player1.pass();
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                this.player2.clickPrompt('Me');
                this.player2.clickCard(this.fuSuiDiciple);
                this.player2.clickPrompt('Dishonor this character');
                expect(this.fuSuiDiciple.isDishonored).toBe(true);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('shouldn\'t allow choosing a character who can\'t be honored or dishonored', function() {
                this.player1.clickCard('know-the-world');
                this.player1.clickRing('void');
                this.player1.clickRing('air');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'military',
                    attackers: ['fu-sui-disciple', 'steward-of-law'],
                    defenders: []
                });
                this.player1.clickCard('charge');
                this.player1.clickCard(this.maraudingOni);
                expect(this.maraudingOni.location).toBe('play area');
                this.fuSuiDiciple = this.player2.clickCard('fu-sui-disciple');
                this.player2.clickPrompt('My Opponent');
                expect(this.player1).toHavePrompt('Fū Sui Disciple');
                expect(this.player1).toBeAbleToSelect('fu-sui-disciple');
                expect(this.player1).not.toBeAbleToSelect(this.maraudingOni);
            });

            it('shouldn\'t allow choosing a player with no character who can be honored or dishonored', function() {
                this.player1.clickCard('know-the-world');
                this.player1.clickRing('void');
                this.player1.clickRing('air');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'earth',
                    type: 'military',
                    attackers: ['fu-sui-disciple', 'steward-of-law'],
                    defenders: []
                });
                this.player1.clickCard('charge');
                this.player1.clickCard(this.maraudingOni);
                expect(this.maraudingOni.location).toBe('play area');
                this.player2.pass();
                this.fuSuiDiciple = this.player1.clickCard('fu-sui-disciple');
                this.player1.clickPrompt('Me');
                this.player1.clickCard(this.fuSuiDiciple);
                this.player1.clickPrompt('Honor this character');
                expect(this.fuSuiDiciple.isHonored).toBe(true);
                this.player2.clickCard('fu-sui-disciple');
                expect(this.player2).toHavePrompt('Fū Sui Disciple');
                expect(this.player2.currentButtons).toContain('Me');
                expect(this.player2.currentButtons).not.toContain('My Opponent');
            });
        });
    });
});
