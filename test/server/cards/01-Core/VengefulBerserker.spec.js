describe('Vengeful Berserker', function() {
    integration(function() {
        describe('Vengeful Berserker\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 0,
                        inPlay: ['vengeful-berserker', 'kaiu-envoy'],
                        hand: ['fine-katana', 'banzai'],
                        dynastyDeck: ['funeral-pyre']
                    }
                });
                this.funeralPyre = this.player1.placeCardInProvince('funeral-pyre');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['vengeful-berserker'],
                    defenders: []
                });
            });

            it('should double Vengeful Berserker\'s military strength', function() {
                this.player2.pass();
                this.player1.clickCard(this.funeralPyre);
                this.player1.clickCard('kaiu-envoy');
                expect(this.player1.player.hand.size()).toBe(3);
                expect(this.player1.fate).toBe(1);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('vengeful-berserker');
                this.vengefulBerserker = this.player1.clickCard('vengeful-berserker');
                expect(this.vengefulBerserker.militarySkill).toBe(6);
                expect(this.player1.player.hand.size()).toBe(4);
            });
        });
    });
});
