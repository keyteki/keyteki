describe('Kanjo District', function() {
    integration(function() {
        describe('Kanjo District\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['ready-for-battle']
                    },
                    player2: {
                        dynastyDeck: ['kanjo-district']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.kanjoDistrict = this.player2.placeCardInProvince('kanjo-district');
                this.player2.player.imperialFavor = 'political';
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
            });

            it('should send the attacker home and bow them', function() {
                this.player2.clickCard(this.kanjoDistrict);
                this.player2.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.bowed).toBe(true);
                expect(this.matsuBerserker.inConflict).toBe(false);
                expect(this.player2.player.imperialFavor).toBe('');
            });

            it('should allow for reactions to both bowing and sending home', function() {
                this.player2.clickCard(this.kanjoDistrict);
                this.player2.clickCard(this.matsuBerserker);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('ready-for-battle');
                expect(this.matsuBerserker.bowed).toBe(true);
                expect(this.matsuBerserker.inConflict).toBe(false);
                this.player1.clickCard('ready-for-battle');
                expect(this.matsuBerserker.bowed).toBe(false);
                expect(this.matsuBerserker.inConflict).toBe(false);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
