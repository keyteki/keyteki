describe('Perfect Land Ethos', function() {
    integration(function() {
        describe('Perfect Land Ethos\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-hotaru', 'kakita-yoshi'],
			                  hand: ['perfect-land-ethos']
                    },
                    player2: {
                        inPlay: ['bayushi-liar']
                    }
                });

		this.perfectLandEthos = this.player1.findCardByName('perfect-land-ethos');
		this.hotaru = this.player1.findCardByName('doji-hotaru');
                this.hotaru.dishonor();
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
		this.yoshi.honor();
                this.liar = this.player2.findCardByName('bayushi-liar');
		this.liar.dishonor();
            });

            it('should remove all status tokens', function() {
		this.player1.clickCard(this.perfectLandEthos);
		expect(this.hotaru.isHonored).toBe(false);
		expect(this.hotaru.isDishonored).toBe(false);
		expect(this.yoshi.isHonored).toBe(false);
		expect(this.yoshi.isDishonored).toBe(false);
		expect(this.liar.isHonored).toBe(false);
		expect(this.liar.isDishonored).toBe(false);
            });
        });
    });
});
