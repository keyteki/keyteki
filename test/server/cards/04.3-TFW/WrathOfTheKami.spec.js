describe('The Wrath of the Kami', function () {
    integration(function () {
        describe('The Wrath of the Kami\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves'],
                        dynastyDeck: ['the-wrath-of-the-kami']
                    },
                    player2: {
                        honor: 10,
                        provinces: ['pilgrimage', 'kuroi-mori'],
                        dynastyDeck: ['the-wrath-of-the-kami']
                    }
                });
                this.wrath1 = this.player1.placeCardInProvince('the-wrath-of-the-kami', 'province 1');
                this.wrath2 = this.player2.placeCardInProvince('the-wrath-of-the-kami', 'province 1');
                this.noMoreActions();
            });

            it('should not activate during a conflict at another province', function () {
                this.initiateConflict({
                    province: 'kuroi-mori',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.player2.clickCard(this.wrath2);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            describe('during a conflict at the holding\'s province', function () {
                beforeEach(function () {
                    this.initiateConflict({
                        province: 'pilgrimage',
                        attackers: ['adept-of-the-waves'],
                        defenders: []
                    });
                    this.player2.clickCard(this.wrath2);
                });

                it('should increase the province\'s strength by 1', function () {
                    // Pilgrimage 5 PS, holding +1 PS, and +1 PS from ability.
                    expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(this.game.currentConflict.conflictProvince.cardData.strength + 2);
                });

                it('should cost 1 honor', function () {
                    expect(this.player2.honor).toBe(9);
                });
            });
        });
    });
});
