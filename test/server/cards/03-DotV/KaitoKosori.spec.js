describe('Kaito Kosori', function() {
    integration(function() {
        describe('Kaito Kosori\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kaito-kosori', 'seeker-of-knowledge', 'shrine-maiden'],
                        dynastyDeck: ['favorable-ground'],
                        hand: ['seeker-of-knowledge']
                    }
                });
                this.favorableGround = this.player1.placeCardInProvince('favorable-ground');
                this.noMoreActions();
            });

            describe('during an air conflict', function() {
                beforeEach(function() {
                    this.initiateConflict({
                        ring: 'air',
                        attackers: ['shrine-maiden'],
                        defenders: []
                    });
                });

                it('should allow Kosori to contribute when she is at home', function() {
                    expect(this.game.currentConflict.attackerSkill).toBe(3);
                });
            });
        });
    });
});
