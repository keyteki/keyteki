describe('Yasuki Taka', function() {
    integration(function() {
        describe('Yasuki Taka\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['yasuki-taka', 'keeper-initiate', 'eager-scout'],
                        hand: ['way-of-the-crab', 'seal-of-the-crab'],
                        dynastyDeck: ['funeral-pyre']
                    },
                    player2: {
                        inPlay: ['stoic-gunso']
                    }
                });
                this.funeralPyre = this.player1.placeCardInProvince('funeral-pyre');
            });

            it('should trigger on a crab character leaving play', function() {
                this.player1.clickCard(this.funeralPyre);
                this.player1.clickCard('eager-scout');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('yasuki-taka');
            });

            it('should grant 1 fate', function() {
                this.player1.clickCard(this.funeralPyre);
                this.player1.clickCard('eager-scout');
                this.player1.clickCard('yasuki-taka');
                expect(this.player1.player.fate).toBe(2);
            });

            it('should trigger on a character with Seal of the Crab', function() {
                this.player1.playAttachment('seal-of-the-crab', 'keeper-initiate');
                this.player2.pass();
                this.player1.clickCard(this.funeralPyre);
                this.player1.clickCard('keeper-initiate');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('yasuki-taka');
            });

            it('should trigger multiple times', function() {
                this.player1.playAttachment('seal-of-the-crab', 'keeper-initiate');
                this.player2.pass();
                this.player1.clickCard(this.funeralPyre);
                this.player1.clickCard('keeper-initiate');
                this.player1.clickCard('yasuki-taka');
                this.player2.pass();
                this.player1.clickCard('way-of-the-crab');
                this.player1.clickCard('eager-scout');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('yasuki-taka');
            });

            it('should trigger on opponent\'s crab characters leaving play', function() {
                this.player1.clickCard('way-of-the-crab');
                this.player1.clickCard('eager-scout');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('yasuki-taka');
                this.player1.clickCard('yasuki-taka');
                expect(this.player2).toHavePrompt('Way of the Crab');
                expect(this.player2).toBeAbleToSelect('stoic-gunso');
                this.stoicGunso = this.player2.clickCard('stoic-gunso');
                expect(this.stoicGunso.location).toBe('conflict discard pile');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('yasuki-taka');
            });
        });
    });
});
