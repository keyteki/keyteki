describe('Chikai Order Protector', function() {
    integration(function() {
        describe('Chikai Order Protector\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['chikai-order-protector', 'adept-of-the-waves', 'radiant-orator', 'serene-warrior']
                    },
                    player2: {
                        inPlay: ['steward-of-law', 'kami-unleashed'],
                        hand: ['for-shame']
                    }
                });
                this.chikaiOrderProtector = this.player1.findCardByName('chikai-order-protector');
                this.noMoreActions();
            });

            it('should not bow as a result of defending a conflict in which a Courtier character participated', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: ['chikai-order-protector', 'radiant-orator']
                });
                this.player1.pass();
                this.player2.pass();
                this.noMoreActions();
                expect(this.chikaiOrderProtector.bowed).toBeFalsy();
            });

            it('should not bow as a result of defending a conflict in which a Shugenja character participated', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: ['chikai-order-protector', 'adept-of-the-waves']
                });
                this.player1.pass();
                this.player2.pass();
                this.noMoreActions();
                expect(this.chikaiOrderProtector.bowed).toBeFalsy();
            });

            it('should bow as a result of defending a conflict in which a Courtier or Shugenja character did not participate', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: ['chikai-order-protector', 'serene-warrior']
                });
                this.player1.pass();
                this.player2.pass();
                this.noMoreActions();
                expect(this.chikaiOrderProtector.bowed).toBeTruthy();
            });

            it('should bow as a result of attacking a conflict in which a Courtier or Shugenja character participated', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['chikai-order-protector', 'adept-of-the-waves'],
                    defenders: ['steward-of-law']
                });
                this.player2.pass();
                this.player1.pass();
                this.noMoreActions();
                expect(this.chikaiOrderProtector.bowed).toBeTruthy();
            });

            it('should bow as a result of a card effect when defending a conflict in which a Courtier or Shugenja character is participating', function() {
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: ['chikai-order-protector', 'adept-of-the-waves']
                });
                this.player1.pass();
                this.player2.clickCard('for-shame');
                this.player2.clickCard(this.chikaiOrderProtector);
                this.player1.clickPrompt('Bow this character');
                expect(this.chikaiOrderProtector.isDishonored).toBeFalsy();
                expect(this.chikaiOrderProtector.bowed).toBeTruthy();
            });
        });
    });
});
