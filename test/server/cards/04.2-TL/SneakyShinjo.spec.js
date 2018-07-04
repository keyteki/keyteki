describe('Sneaky Shinjo', function() {
    integration(function() {
        describe('Sneaky Shinjo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        fate: 7,
                        dynastyDeck: ['sneaky-shinjo', 'utaku-infantry']
                    }
                });
                this.sneakyShinjo = this.player1.placeCardInProvince('sneaky-shinjo');
                this.utakuInfantry = this.player1.placeCardInProvince('utaku-infantry', 'province 2');
                this.adeptOfTheWaves = this.player2.placeCardInProvince('adept-of-the-waves');
                this.player1.clickCard(this.utakuInfantry);
                this.player1.clickPrompt('1');
            });

            it('should trigger when its player passes first', function() {
                this.player2.clickCard(this.adeptOfTheWaves);
                this.player2.clickPrompt('1');
                expect(this.player1.fate).toBe(5);
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.sneakyShinjo);
            });

            it('should trigger when its player passes second', function() {
                this.player2.pass();
                expect(this.player1.fate).toBe(5);
                this.player1.pass();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.sneakyShinjo);
            });

            it('should put sneaky shinjo into play', function() {
                this.player2.clickCard(this.adeptOfTheWaves);
                this.player2.clickPrompt('1');
                expect(this.player1.fate).toBe(5);
                this.player1.pass();
                expect(this.player1.fate).toBe(6);
                this.player1.clickCard(this.sneakyShinjo);
                expect(this.player1).toHavePrompt('Sneaky Shinjo');
                this.player1.clickPrompt('2');
                expect(this.sneakyShinjo.location).toBe('play area');
                expect(this.sneakyShinjo.fate).toBe(2);
                expect(this.player1.fate).toBe(3);
            });
        });
    });
});
