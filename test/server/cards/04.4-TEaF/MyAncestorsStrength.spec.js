describe('My Ancestors Strength', function() {
    integration(function() {
        describe('My Ancestors Strength ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['fearsome-mystic', 'asako-diplomat'],
                        hand: ['my-ancestor-s-strength'],
                        dynastyDiscard: ['fushicho', 'naive-student']
                    },
                    player2: {
                        inPlay: ['moto-nergui']
                    }
                });
                this.noMoreActions();
            });

            it('should allow you to swap base skills when a shugenja is participating', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'earth',
                    attackers: ['fearsome-mystic'],
                    defenders: ['moto-nergui']
                });
                this.player2.pass();
                this.player1.clickCard('my-ancestor-s-strength');
                this.fearsomeMystic = this.player1.clickCard('fearsome-mystic');
                this.player1.clickCard('fushicho');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.fearsomeMystic.militarySkill).toBe(6);
                expect(this.fearsomeMystic.politicalSkill).toBe(6);
            });

            it('should allow you to swap base dash skill values when a shugenja is participating', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'earth',
                    attackers: ['fearsome-mystic'],
                    defenders: ['moto-nergui']
                });
                this.player2.pass();
                this.player1.clickCard('my-ancestor-s-strength');
                this.fearsomeMystic = this.player1.clickCard('fearsome-mystic');
                this.player1.clickCard('naive-student');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.fearsomeMystic.hasDash('military')).toBeTruthy();
                expect(this.fearsomeMystic.politicalSkill).toBe(2);
            });

            it('should not trigger if a shugenja is not participating in the conflict', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'air',
                    attackers: ['asako-diplomat'],
                    defenders: ['moto-nergui']
                });
                this.player2.pass();
                this.player1.clickCard('my-ancestor-s-strength');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not allow the selection of a non-shugenja character as a target', function() {
                this.initiateConflict({
                    type: 'political',
                    ring: 'air',
                    attackers: ['fearsome-mystic', 'asako-diplomat'],
                    defenders: ['moto-nergui']
                });
                this.player2.pass();
                this.player1.clickCard('my-ancestor-s-strength');
                this.asakoDiplomat = this.player1.findCardByName('asako-diplomat');
                expect(this.player1).not.toBeAbleToSelect(this.asakoDiplomat);
            });
        });
    });
});
