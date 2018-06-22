describe('City of Lies', function() {
    integration(function() {
        describe('City of Lies\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        hand: ['against-the-waves', 'against-the-waves'],
                        dynastyDeck: ['city-of-lies']
                    },
                    player2: {
                        inPlay: ['isawa-kaede']
                    }
                });
                this.cityOfLies = this.player1.placeCardInProvince('city-of-lies');
                this.isawaKaede = this.player2.findCardByName('isawa-kaede');
            });

            it('should not change the cost of events before being used', function() {
                expect(this.isawaKaede.bowed).toBe(false);
                this.player1.clickCard('against-the-waves');
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.isawaKaede);
                expect(this.player1.player.fate).toBe(4);
                expect(this.isawaKaede.bowed).toBe(true);
            });

            it('should reduce the cost of the next event played when used', function() {
                this.player1.clickCard(this.cityOfLies);
                this.player2.pass();
                expect(this.isawaKaede.bowed).toBe(false);
                this.player1.clickCard('against-the-waves');
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.isawaKaede);
                expect(this.isawaKaede.bowed).toBe(true);
                expect(this.player1.player.fate).toBe(5);
                this.player2.pass();
                this.player1.clickCard('against-the-waves', 'hand');
                expect(this.player1).toHavePrompt('Against the Waves');
                this.player1.clickCard(this.isawaKaede);
                expect(this.isawaKaede.bowed).toBe(false);
                expect(this.player1.player.fate).toBe(4);
            });
        });
    });
});
