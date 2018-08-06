describe('Yasuki Broker', function() {
    integration(function() {
        describe('Yasuki Broker\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['yasuki-broker', 'hida-guardian'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['border-rider']
                    }
                });

                this.yasukiBroker = this.player1.findCardByName('yasuki-broker');
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');

                this.borderRider = this.player2.findCardByName('border-rider');

                this.noMoreActions();
            });

            it('should give all characters courtesy and sincerity while participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yasukiBroker],
                    defenders: [this.borderRider]
                });
                expect(this.yasukiBroker.hasSincerity()).toBe(true);
                expect(this.yasukiBroker.hasCourtesy()).toBe(true);
                expect(this.hidaGuardian.hasSincerity()).toBe(true);
                expect(this.hidaGuardian.hasCourtesy()).toBe(true);
                expect(this.borderRider.hasSincerity()).toBe(false);
                expect(this.borderRider.hasCourtesy()).toBe(false);
            });

            it('should not give all characters courtesy and sincerity when not participating', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.hidaGuardian],
                    defenders: [this.borderRider]
                });
                expect(this.yasukiBroker.hasSincerity()).toBe(false);
                expect(this.yasukiBroker.hasCourtesy()).toBe(false);
                expect(this.hidaGuardian.hasSincerity()).toBe(false);
                expect(this.hidaGuardian.hasCourtesy()).toBe(false);
                expect(this.borderRider.hasSincerity()).toBe(false);
                expect(this.borderRider.hasCourtesy()).toBe(false);
            });
        });
    });
});
