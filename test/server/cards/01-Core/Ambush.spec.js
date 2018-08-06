describe('Ambush', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['Adept of the Waves']
                },
                player2: {
                    fate: 50,
                    inPlay: ['Adept of the Waves'],
                    hand: ['Ambush', 'Adept of Shadows', 'Adept of Shadows', 'Adept of Shadows', 'bayushi-kachiko', 'vengeful-oathkeeper']
                }
            });
            this.noMoreActions();
            this.initiateConflict({
                attackers: ['Adept of the Waves'],
                defenders: ['Adept of the Waves']
            });
            this.ambush = this.player2.hand[0];
            this.adept1 = this.player2.hand[1];
            this.adept2 = this.player2.hand[2];
            this.adept3 = this.player2.hand[3];
            this.kachiko = this.player2.hand[4];
            this.lion = this.player2.hand[5];
        });

        describe('When playing Ambush', function() {
            beforeEach(function() {
                this.player2.clickCard(this.ambush, 'hand');
            });

            it('should not allow the player to select more than 2 characters', function() {
                this.player2.clickCard(this.adept1, 'hand');
                this.player2.clickCard(this.adept2, 'hand');
                this.player2.clickCard(this.adept3, 'hand');
                expect(this.player2.selectedCards.length).toBe(2);
            });

            it('should not allow the player to select characters with more than 6 cost', function() {
                this.player2.clickCard(this.adept1, 'hand');
                this.player2.clickCard(this.kachiko, 'hand');
                expect(this.player2.selectedCards.includes(this.kachiko)).toBe(false);
            });

            it('should not allow the player to select non-Scorpion characters', function() {
                expect(this.player2.currentActionTargets.includes(this.lion)).toBe(false);
            });
        });
    });
});
