describe('Kaito Temple Protector', function() {
    integration(function() {
        describe('Kaito Temple Protector\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['master-of-the-spear']
                    },
                    player2: {
                        inPlay: ['kaito-temple-protector', 'shinjo-outrider']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['master-of-the-spear'],
                    defenders: ['kaito-temple-protector']
                });
            });

            it('should make Master of the Spear\'s action illegal if he is the only defender', function() {
                this.player2.pass();
                this.player1.clickCard('master-of-the-spear');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be a legal target for MotS', function() {
                this.shinjoOutrider = this.player2.clickCard('shinjo-outrider');
                expect(this.shinjoOutrider.inConflict).toBe(true);
                this.player1.clickCard('master-of-the-spear');
                expect(this.player2).toHavePrompt('Master of the Spear');
                expect(this.player2).toBeAbleToSelect(this.shinjoOutrider);
                expect(this.player2).not.toBeAbleToSelect('kaito-temple-protector');
            });

            it('should have DEF effect on GHI', function() {

            });
        });
    });
});
