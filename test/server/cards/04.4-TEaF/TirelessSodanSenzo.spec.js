describe('Tireless Sodan Senzo', function() {
    integration(function() {
        describe('Tireless Sodan Senzo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['tireless-sodan-senzo']
                    },
                    player2: {
                        inPlay: ['matsu-berserker'],
                        provinces: ['shameful-display']
                    }
                });
                this.senzo = this.player1.findCardByName('tireless-sodan-senzo');

                this.berserker = this.player2.findCardByName('matsu-berserker');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');

                this.noMoreActions();
            });

            it('should not bow after losing a conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    province: this.shamefulDisplay,
                    attackers: [this.senzo],
                    defenders: [this.berserker],
                    jumpTo: 'afterConflict'
                });
                expect(this.senzo.bowed).toBe(false);
            });
        });
    });
});
