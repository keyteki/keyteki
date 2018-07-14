describe('Mantis Seafarer', function () {
    integration(function () {
        describe('Mantis Seafarer\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        fate: 1,
                        inPlay: ['mantis-seafarer', 'fire-tensai-initiate', 'adept-of-the-waves']
                    },
                    player2: {
                        inPlay: ['mantis-seafarer', 'kuni-yori']
                    }
                });
                this.seafarer = this.player1.findCardByName('mantis-seafarer');
                this.seafarer2 = this.player2.findCardByName('mantis-seafarer');
                this.noMoreActions();
            });

            it('should trigger when the seafarer wins as the attacker', function () {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['mantis-seafarer'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.seafarer);
            });

            it('should trigger when the seafarer wins as the defender', function () {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['fire-tensai-initiate'],
                    defenders: ['mantis-seafarer']
                });
                this.noMoreActions();
                expect(this.player2).toBeAbleToSelect(this.seafarer2);
            });

            it('should be able to trigger off of multiple conflict wins', function () {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['mantis-seafarer'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.seafarer);
                this.player1.clickCard(this.seafarer);
                this.player1.clickPrompt('Don\'t Resolve');
                this.seafarer.bowed = false;
                this.noMoreActions();
                this.player2.clickPrompt('Pass Conflict');
                this.player2.clickPrompt('Yes');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    attackers: ['mantis-seafarer'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toBeAbleToSelect(this.seafarer);
            });

            it('should not trigger when the seafarer loses a conflict', function () {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['mantis-seafarer'],
                    defenders: ['kuni-yori']
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger when the seafarer is not present', function () {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['adept-of-the-waves'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Air Ring');
            });

            describe('when it is triggered', function () {
                beforeEach(function () {
                    this.initiateConflict({
                        type: 'military',
                        ring: 'air',
                        attackers: ['mantis-seafarer'],
                        defenders: []
                    });
                    this.initHonor = this.player1.honor;
                    this.initFate = this.player1.fate;
                    this.noMoreActions();
                    this.player1.clickCard(this.seafarer);
                });

                it('should cost 1 honor', function () {
                    expect(this.player1.honor).toBe(this.initHonor - 1);
                });

                it('should gain 1 fate', function () {
                    expect(this.player1.fate).toBe(this.initFate + 1);
                });
            });
        });
    });
});
