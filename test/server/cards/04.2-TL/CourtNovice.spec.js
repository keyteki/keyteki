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
                this.player1.claimRing('air');
                expect(this.novice.getPoliticalSkill()).toBe(3);
            });

            it('should give +2 to political skill if the water ring is claimed', function() {
                this.player1.claimRing('water');
                expect(this.novice.getPoliticalSkill()).toBe(3);
            });

            it('should not give +2 to political skill if the opponent claimed the air or water ring', function() {
                this.player2.claimRing('air');
                this.player2.claimRing('water');
                expect(this.novice.getPoliticalSkill()).toBe(1);
            });

            it('should not give +2 to political skill if any other ring is claimed', function() {
                this.player1.claimRing('earth');
                this.player1.claimRing('fire');
                this.player1.claimRing('void');
                expect(this.novice.getPoliticalSkill()).toBe(1);
            });
        });
    });
});
