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
                this.player1.claimRing('fire');
                expect(this.novice.getMilitarySkill()).toBe(3);
                expect(this.novice.getPoliticalSkill()).toBe(3);
            });

            it('should give +1 to both skills if the void ring is claimed', function() {
                this.player1.claimRing('void');
                expect(this.novice.getMilitarySkill()).toBe(3);
                expect(this.novice.getPoliticalSkill()).toBe(3);
            });

            it('not give +1 to both skills if the opponent claimed the void or fire ring', function() {
                this.player2.claimRing('fire');
                this.player2.claimRing('void');
                expect(this.novice.getMilitarySkill()).toBe(2);
                expect(this.novice.getPoliticalSkill()).toBe(2);
            });

            it('not give +1 to both skills if any other ring is claimed', function() {
                this.player1.claimRing('air');
                this.player1.claimRing('earth');
                this.player1.claimRing('water');
                expect(this.novice.getMilitarySkill()).toBe(2);
                expect(this.novice.getPoliticalSkill()).toBe(2);
            });
        });
    });
});
