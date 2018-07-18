describe('Fight On', function() {
    integration(function() {
        describe('Fight On\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shrewd-yasuki', 'vanguard-warrior']
                    },
                    player2: {
                        inPlay: ['borderlands-defender'],
                        hand: ['fight-on']
                    }
                });

                this.borderlandsDefender = this.player2.inPlay[0];
                this.borderlandsDefender.bow();
                this.vaguardWarrior = this.player1.inPlay[1];
                this.vaguardWarrior.bow();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['shrewd-yasuki'],
                    defenders: []
                });
                this.player2.clickCard('fight-on');
            });

            it('should ready selected bowed character and move it to the conflict', function() {
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.borderlandsDefender.bowed).toBeFalsy();
                expect(this.borderlandsDefender.inConflict).toBeTruthy();
            });

            it('should not be able to select an opponents character', function() {
                expect(this.player2).not.toBeAbleToSelect(this.vaguardWarrior);
            });
        });
    });
});
