describe('Court Novice', function() {
    integration(function() {
        describe('Court Novice\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['court-novice']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.novice = this.player1.findCardByName('court-novice');
                this.noMoreActions();
            });

            it('should give +2 to political skill if the air ring is claimed', function() {
                this.game.rings.air.claimRing(this.player1.player);
                this.game.checkGameState(true);
                expect(this.novice.getPoliticalSkill()).toBe(3);
            });

            it('should give +2 to political skill if the water ring is claimed', function() {
                this.game.rings.water.claimRing(this.player1.player);
                this.game.checkGameState(true);
                expect(this.novice.getPoliticalSkill()).toBe(3);
            });

            it('should not give +2 to political skill if the opponent claimed the air or water ring', function() {
                this.game.rings.air.claimRing(this.player2.player);
                this.game.rings.water.claimRing(this.player2.player);
                this.game.checkGameState(true);
                expect(this.novice.getPoliticalSkill()).toBe(1);
            });

            it('should not give +2 to political skill if any other ring is claimed', function() {
                this.game.rings.void.claimRing(this.player1.player);
                this.game.rings.earth.claimRing(this.player1.player);
                this.game.rings.fire.claimRing(this.player1.player);
                this.game.checkGameState(true);
                expect(this.novice.getPoliticalSkill()).toBe(1);
            });
        });
    });
});
