describe('Ikoma Reservist', function() {
    integration(function() {
        describe('Ikoma Reservist\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-reservist']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.reservist = this.player1.findCardByName('ikoma-reservist');
                this.noMoreActions();
            });

            it('should give +2 to military skill if the fire ring is claimed', function() {
                this.player1.claimRing('fire');
                expect(this.reservist.getMilitarySkill()).toBe(3);
            });

            it('should give +2 to military skill if the water ring is claimed', function() {
                this.player1.claimRing('water');
                expect(this.reservist.getMilitarySkill()).toBe(3);
            });

            it('should not give +2 to military skill if the opponent claimed the air or water ring', function() {
                this.player2.claimRing('fire');
                this.player2.claimRing('water');
                expect(this.reservist.getMilitarySkill()).toBe(1);
            });

            it('should not give +2 to military skill if any other ring is claimed', function() {
                this.player1.claimRing('air');
                this.player1.claimRing('earth');
                this.player1.claimRing('void');
                expect(this.reservist.getMilitarySkill()).toBe(1);
            });
        });
    });
});
