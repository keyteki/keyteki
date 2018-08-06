describe('Young Rumormonger', function() {
    integration(function() {
        describe('Spies At Court interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['young-rumormonger', 'otomo-courtier'],
                        hand: ['spies-at-court']
                    },
                    player2: {
                        hand: ['banzai', 'charge']
                    }
                });
                this.noMoreActions();
            });

            it('when Young Rumormonger\'s ability is used to change the unit paying the cost, the ability should still work', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['otomo-courtier'],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.spiesAtCourt = this.player1.findCardByName('spies-at-court');
                expect(this.player1).toBeAbleToSelect(this.spiesAtCourt);
                this.player1.clickCard(this.spiesAtCourt);
                this.otomoCourtier = this.player1.clickCard('otomo-courtier');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.youngRumormonger = this.player1.findCardByName('young-rumormonger');
                expect(this.player1).toBeAbleToSelect(this.youngRumormonger);
                this.player1.clickCard(this.youngRumormonger);
                this.player1.clickCard(this.youngRumormonger);
                expect(this.player2).toHavePrompt('Spies At Court');
                expect(this.youngRumormonger.isDishonored).toBe(true);
                expect(this.otomoCourtier.isDishonored).toBe(false);
                expect(this.player2).toBeAbleToSelect('banzai');
                this.player2.clickPrompt('Done');
                expect(this.player2.hand.length).toBe(0);
            });
        });

        describe('Forged Edict interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['young-rumormonger', 'otomo-courtier', 'seppun-guardsman'],
                        hand: ['forged-edict']
                    },
                    player2: {
                        hand: ['mirumoto-s-fury']
                    }
                });
                this.youngRumormonger = this.player1.findCardByName('young-rumormonger');
                this.otomoCourtier = this.player1.findCardByName('otomo-courtier');
                this.seppunGuardsman = this.player1.findCardByName('seppun-guardsman');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.youngRumormonger],
                    defenders: []
                });
                this.player2.clickCard('mirumoto-s-fury');
                this.player2.clickCard(this.youngRumormonger);
            });

            it('when Young Rumormonger\'s ability is used to change the unit paying the cost to a courtier, the ability should still work', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('forged-edict');
                this.player1.clickCard('forged-edict');
                this.player1.clickCard(this.youngRumormonger);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.youngRumormonger);
                this.player1.clickCard(this.youngRumormonger);
                expect(this.player1).toHavePrompt('Young Rumormonger');
                expect(this.player1).toBeAbleToSelect(this.otomoCourtier);
                this.player1.clickCard(this.otomoCourtier);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.youngRumormonger.bowed).toBe(false);
                expect(this.youngRumormonger.isDishonored).toBe(false);
                expect(this.otomoCourtier.isDishonored).toBe(true);
            });

            it('when Young Rumormonger\'s ability is used to change the unit paying the cost to a non-courtier, the ability should still work', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('forged-edict');
                this.player1.clickCard('forged-edict');
                this.player1.clickCard(this.youngRumormonger);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.youngRumormonger);
                this.player1.clickCard(this.youngRumormonger);
                expect(this.player1).toHavePrompt('Young Rumormonger');
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.youngRumormonger.bowed).toBe(false);
                expect(this.youngRumormonger.isDishonored).toBe(false);
                expect(this.seppunGuardsman.isDishonored).toBe(true);
            });
        });
    });
});
