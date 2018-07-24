describe('Tactican\'s Apprentice', function() {
    integration(function() {
        describe('Tactician\'s Apprentice\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['tactician-s-apprentice'],
                        hand: ['policy-debate']
                    },
                    player2: {
                        inPlay: ['adept-of-the-waves'],
                        hand: ['court-games']
                    }
                });
            });

            it('should trigger when its controller bids lower', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('tactician-s-apprentice');
            });

            it('should not trigger when its controller bids equal/higher', function() {
                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('should be triggerable once each phase', function() {
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                this.player1.clickCard('tactician-s-apprentice');
                this.noMoreActions();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['tactician-s-apprentice'],
                    defenders: ['adept-of-the-waves']
                });
                this.player2.clickPrompt('pass');
                this.player1.clickCard('policy-debate');
                this.player1.clickCard('tactician-s-apprentice');
                this.player1.clickCard(this.player2.findCardByName('adept-of-the-waves'));
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect('tactician-s-apprentice');
            });
        });
    });
});
