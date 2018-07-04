describe('Impulsive Novice', function() {
    integration(function() {
        describe('Impulsive Novice\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['impulsive-novice']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.novice = this.player1.findCardByName('impulsive-novice');
                this.noMoreActions();
            });

            it('should give +1 to both skills if the fire ring is claimed', function() {
                this.game.rings.fire.claimRing(this.player1.player);
                this.game.checkGameState(true);
                expect(this.novice.getMilitarySkill()).toBe(3);
                expect(this.novice.getPoliticalSkill()).toBe(3);
            });

            it('should give +1 to both skills if the void ring is claimed', function() {
                this.game.rings.void.claimRing(this.player1.player);
                this.game.checkGameState(true);
                expect(this.novice.getMilitarySkill()).toBe(3);
                expect(this.novice.getPoliticalSkill()).toBe(3);
            });

            it('not give +1 to both skills if the opponent claimed the void or fire ring', function() {
                this.game.rings.void.claimRing(this.player2.player);
                this.game.rings.fire.claimRing(this.player2.player);
                this.game.checkGameState(true);
                expect(this.novice.getMilitarySkill()).toBe(2);
                expect(this.novice.getPoliticalSkill()).toBe(2);
            });

            it('not give +1 to both skills if any other ring is claimed', function() {
                this.game.rings.water.claimRing(this.player1.player);
                this.game.rings.air.claimRing(this.player1.player);
                this.game.rings.earth.claimRing(this.player1.player);
                this.game.checkGameState(true);
                expect(this.novice.getMilitarySkill()).toBe(2);
                expect(this.novice.getPoliticalSkill()).toBe(2);
            });
        });
    });
});
