describe('Ride Them Down', function() {
    integration(function() {
        describe('Ride Them Down\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['ride-them-down']
                    },
                    player2: {
                        inPlay: [],
                        provinces: ['pilgrimage'],
                        dynastyDeck: ['favorable-ground']
                    }
                });
            });

            it('should trigger during a conflict when the player owns the favor', function() {
                this.player1.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    province: 'pilgrimage',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('ride-them-down', 'hand');
                expect(this.player1.player.imperialFavor).toBe('');
            });

            it('should not trigger if the player does not own the favor', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    province: 'pilgrimage',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('ride-them-down', 'hand');
                expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(this.game.currentConflict.conflictProvince.cardData.strength);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should set the province strength to 1', function() {
                this.player1.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    province: 'pilgrimage',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('ride-them-down', 'hand');
                expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(1);
            });

            describe('when the province has a holding', function() {
                beforeEach(function() {
                    this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');
                    this.player1.player.imperialFavor = 'military';
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        province: 'pilgrimage',
                        attackers: ['adept-of-the-waves'],
                        defenders: []
                    });
                    this.player2.pass();
                    this.player1.clickCard('ride-them-down', 'hand');
                });

                it('the total province strength should be 1 plus the holding bonus', function() {
                    let holdingStr = parseInt(this.favorableGround.cardData.strength_bonus, 10);
                    expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(1 + holdingStr);
                });
            });
        });
    });
});
