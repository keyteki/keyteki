describe('Disdainful Remark', function () {
    integration(function () {
        describe('Disdainful Remark\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider'],
                        hand: ['banzai', 'banzai', 'banzai']
                    },
                    player2: {
                        inPlay: ['asako-tsuki', 'adept-of-the-waves'],
                        provinces: ['pilgrimage'],
                        hand: ['disdainful-remark']
                    }
                });
                this.noMoreActions();
            });

            it('should not activate during a conflict if no defenders are present', function () {
                this.initiateConflict({
                    province: 'pilgrimage',
                    attackers: ['shinjo-outrider'],
                    defenders: []
                });
                this.player2.clickCard('disdainful-remark', 'hand');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not activate during a conflict if no defending courtier is present', function () {
                this.initiateConflict({
                    province: 'pilgrimage',
                    attackers: ['shinjo-outrider'],
                    defenders: ['adept-of-the-waves']
                });
                this.player2.clickCard('disdainful-remark', 'hand');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            describe('during a conflict with a defending courtier present', function () {
                beforeEach(function () {
                    this.initiateConflict({
                        province: 'pilgrimage',
                        attackers: ['shinjo-outrider'],
                        defenders: ['asako-tsuki']
                    });
                    this.player2.clickCard('disdainful-remark', 'hand');
                });

                it('should increase the province\'s strength by the opponent\'s hand size', function () {
                    // Pilgrimage 5 PS, card ability +3 from opponent's hand size
                    expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(this.game.currentConflict.conflictProvince.cardData.strength + this.player1.hand.length);
                });
            });
        });
    });
});
