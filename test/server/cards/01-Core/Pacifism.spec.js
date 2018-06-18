describe('Pacifism', function() {
    integration(function() {
        describe('Pacifism\'s persistent ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-kazue', 'seppun-guardsman'],
                        dynastyDeck: ['favorable-ground']
                    },
                    player2: {
                        hand: ['pacifism', 'captive-audience']
                    }
                });
                this.togashiKazue = this.player1.findCardByName('togashi-kazue');
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground');
                this.player1.pass();
                this.player2.playAttachment('pacifism', this.togashiKazue);
                this.noMoreActions();
            });

            it('should not allow the character with pacifism to be declared in a military conflict', function() {
                expect(this.player1).toHavePrompt('Initiate Conflict');
                this.player1.clickRing('air');
                expect(this.game.currentConflict.conflictType).toBe('military');
                this.player1.clickCard(this.togashiKazue);
                expect(this.togashiKazue.inConflict).toBe(false);
                expect(this.game.currentConflict.attackers).not.toContain(this.togashiKazue);
            });

            it('should remove the pacified character from the conflict if it switches from mil to pol', function() {
                this.player1.clickRing('earth');
                this.player1.clickCard(this.togashiKazue);
                expect(this.game.currentConflict.conflictType).toBe('political');
                expect(this.togashiKazue.inConflict).toBe(true);
                expect(this.game.currentConflict.attackers).toContain(this.togashiKazue);
                expect(this.togashiKazue.bowed).toBe(false);
                this.player1.clickRing('earth');
                expect(this.game.currentConflict.conflictType).toBe('military');
                expect(this.togashiKazue.inConflict).toBe(false);
                expect(this.game.currentConflict.attackers).not.toContain(this.togashiKazue);
                expect(this.togashiKazue.bowed).toBe(false);
            });

            it('should not allow a pacified character to move into a military conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['seppun-guardsman'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.favorableGround);
                expect(this.player1).not.toBeAbleToSelect(this.togashiKazue);
            });

            it('should send a pacified character home if the conflict switches from military to political', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.togashiKazue],
                    defenders: []
                });
                expect(this.game.currentConflict.attackers).toContain(this.togashiKazue);
                expect(this.togashiKazue.bowed).toBe(false);
                this.player2.clickCard('captive-audience');
                expect(this.game.currentConflict.attackers).not.toContain(this.togashiKazue);
                expect(this.togashiKazue.inConflict).toBe(false);
                expect(this.togashiKazue.bowed).toBe(true);
            });
        });
    });
});
