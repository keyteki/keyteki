describe('Radiant Orator', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['Bayushi Kachiko']
                },
                player2: {
                    inPlay: ['Radiant Orator', 'Serene Warrior']
                }
            });
            this.noMoreActions();
        });

        describe('If Orator\'s side has less glory', function() {
            it('shouldn\'t be able to use its ability', function() {
                this.initiateConflict({
                    ring: 'air',
                    attackers: ['Bayushi Kachiko'],
                    defenders: ['Radiant Orator']
                });
                this.player2.clickCard('Radiant Orator', 'play area');

                expect(this.player2).not.toHavePrompt('Choose a character');
            });
        });

        describe('If additional rings are claimed', function() {
            beforeEach(function() {
                this.game.rings['water'].claimRing(this.player2);
                this.game.rings['earth'].claimRing(this.player2);                
                this.initiateConflict({
                    ring: 'air',
                    attackers: ['Bayushi Kachiko'],
                    defenders: ['Radiant Orator']
                });
            });

            it('shouldn\'t be able to use its ability', function() {
                this.player2.clickCard('Radiant Orator', 'play area');

                expect(this.player2).not.toHavePrompt('Choose a character');
            });
        });

        describe('If Serene Warrior is declared as a defender', function() {
            beforeEach(function() {
                this.initiateConflict({
                    ring: 'air',
                    attackers: ['Bayushi Kachiko'],
                    defenders: ['Radiant Orator', 'serene-warrior']
                });
                this.warrior = this.player2.findCardByName('serene-warrior');
                this.player2.clickCard('Radiant Orator', 'play area');
            });

            it('should have Serene Warrior in the conflict', function() {
                expect(this.warrior.inConflict).toBe(true);
            });

            it('should be able to use its ability', function() {
                expect(this.player2).toHavePrompt('Choose a character');
            });

            describe('If Bayushi Kachiko is chosen', function() {
                it('should be removed from the conflict', function() {
                    this.player2.clickCard('Bayushi Kachiko', 'play area', 'opponent');

                    expect(this.game.currentConflict.attackers.length).toBe(0);
                });
            });
        });
    });
});
