describe('Chisei District', function () {
    integration(function () {
        describe('Chisei District\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'seppun-guardsman']
                    },
                    player2: {
                        provinces: ['pilgrimage'],
                        dynastyDeck: ['chisei-district']
                    }
                });
                this.chisei2 = this.player2.placeCardInProvince('chisei-district', 'province 1');
                this.noMoreActions();
            });

            it('should not allow military conflicts to be declared against it\'s province', function () {
                let _this = this;
                expect(function () {
                    _this.initiateConflict({
                        type: 'military',
                        province: 'pilgrimage',
                        attackers: ['adept-of-the-waves'],
                        defenders: []
                    });
                }).toThrow();
                expect(this.player1).toHavePrompt('Choose province to attack');
            });

            it('should allow political conflicts to be declared against it\'s province', function () {
                this.initiateConflict({
                    type: 'political',
                    province: 'pilgrimage',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

