describe('Hurricane Punch', function() {
    integration(function() {
        describe('Hurricane Punch\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        conflictDeck: ['charge'],
                        inPlay: ['itinerant-philosopher', 'agasha-sumiko'],
                        hand: ['hurricane-punch']
                    },
                    player2: {
                        dynastyDeck: ['fire-tensai-initiate']
                    }
                });
                this.itinerantPhilosopher = this.player1.findCardByName('itinerant-philosopher');
                this.agashaSumiko = this.player1.findCardByName('agasha-sumiko');
                this.fireTensaiInitiate = this.player2.placeCardInProvince('fire-tensai-initiate');
                this.hurricanePunch = this.player1.findCardByName('hurricane-punch');
                this.noMoreActions();
            });

            it('should only work on participating characters', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.itinerantPhilosopher],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.hurricanePunch);
                expect(this.player1).toHavePrompt('Hurricane Punch');
                expect(this.player1).toBeAbleToSelect(this.itinerantPhilosopher);
                expect(this.player1).not.toBeAbleToSelect(this.agashaSumiko);
            });

            it('should give +2/+0', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.itinerantPhilosopher, this.agashaSumiko],
                    defenders: []
                });
                this.player2.pass();
                let currentMilitarySkill = this.itinerantPhilosopher.getMilitarySkill();
                let currentPoliticalSkill = this.itinerantPhilosopher.getPoliticalSkill();
                this.player1.clickCard(this.hurricanePunch);
                this.player1.clickCard(this.itinerantPhilosopher);
                expect(this.itinerantPhilosopher.getMilitarySkill()).toBe(currentMilitarySkill + 2);
                expect(this.itinerantPhilosopher.getPoliticalSkill()).toBe(currentPoliticalSkill);
            });

            it('should draw 1 card', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.itinerantPhilosopher, this.agashaSumiko],
                    defenders: []
                });
                this.player2.pass();
                let hand = this.player1.hand.length;
                let conflictDeck = this.player1.conflictDeck.length;
                this.player1.clickCard(this.hurricanePunch);
                this.player1.clickCard(this.itinerantPhilosopher);
                expect(this.player1.hand.length).toBe(hand);
                expect(this.player1.conflictDeck.length).toBe(conflictDeck - 1);
            });
        });
    });
});
