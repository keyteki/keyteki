describe('Specialized Defenses', function() {
    integration(function() {
        describe('Specialized Defenses\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        hand: ['charge'],
                        dynastyDiscard: ['isawa-kaede']
                    },
                    player2: {
                        provinces: ['kuroi-mori'],
                        hand: ['specialized-defenses']
                    }
                });
                this.isawaKaede = this.player1.placeCardInProvince('isawa-kaede');
                this.kuroiMori = this.player2.findCardByName('kuroi-mori');
                this.noMoreActions();
                this.initiateConflict({
                    province: this.kuroiMori,
                    attackers: ['matsu-berserker'],
                    defenders: []
                });
            });

            it('should not be playable when the element and the contested ring do not match', function() {
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard('specialized-defenses');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should be playable when the contested ring matches the province element', function() {
                this.player2.clickCard(this.kuroiMori);
                this.player2.clickPrompt('Switch the contested ring');
                this.player2.clickRing('void');
                expect(this.game.currentConflict.ring.element).toBe('void');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.pass();
                this.player2.clickCard('specialized-defenses');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.kuroiMori.strength).toBe(8);
            });

            it('should be playable if the player has claimed the matching ring', function() {
                this.player2.claimRing('void');
                this.player2.clickCard('specialized-defenses');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.kuroiMori.strength).toBe(8);
            });

            it('should be playable if the contested ring has an additional element which matches', function() {
                this.player2.pass();
                this.player1.clickCard('charge');
                this.player1.clickCard(this.isawaKaede);
                expect(this.isawaKaede.inConflict).toBe(true);
                this.player2.clickCard('specialized-defenses');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.kuroiMori.strength).toBe(8);
            });
        });
    });
});
