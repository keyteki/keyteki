describe('Chikai Order Protector', function() {
    integration(function() {
        describe('Chikai Order Protector\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law', 'kami-unleashed'],
                        hand: ['for-shame']
                    },
                    player2: {
                        inPlay: ['chikai-order-protector', 'adept-of-the-waves', 'radiant-orator', 'serene-warrior']
                    }
                });
                this.chikaiOrderProtector = this.player2.findCardByName('chikai-order-protector');
                this.noMoreActions();
            });

            it('should not bow as a result of defending a conflict in which a Courtier character participated', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: ['chikai-order-protector', 'radiant-orator']
                });
                this.noMoreActions();
                expect(this.chikaiOrderProtector.bowed).toBeFalsy();
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not bow as a result of defending a conflict in which a Shugenja character participated', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: ['chikai-order-protector', 'adept-of-the-waves']
                });
                this.noMoreActions();
                expect(this.chikaiOrderProtector.bowed).toBeFalsy();
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should bow as a result of defending a conflict in which a Courtier or Shugenja character did not participate', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: ['chikai-order-protector', 'serene-warrior']
                });
                this.noMoreActions();
                expect(this.chikaiOrderProtector.bowed).toBeTruthy();
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should bow as a result of attacking a conflict in which a Courtier or Shugenja character participated', function() {
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['chikai-order-protector', 'adept-of-the-waves'],
                    defenders: ['steward-of-law']
                });
                this.noMoreActions();
                this.player2.clickPrompt('No');
                this.player2.clickPrompt('Gain 2 honor');
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.chikaiOrderProtector.bowed).toBeTruthy();
            });

            it('should bow as a result of a card effect when defending a conflict in which a Courtier or Shugenja character is participating', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: ['chikai-order-protector', 'adept-of-the-waves']
                });
                this.player2.pass();
                this.player1.clickCard('for-shame');
                this.player1.clickCard(this.chikaiOrderProtector);
                expect(this.chikaiOrderProtector.isDishonored).toBeFalsy();
                expect(this.chikaiOrderProtector.bowed).toBeTruthy();
            });
        });
    });
});
