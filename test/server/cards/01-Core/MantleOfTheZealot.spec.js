describe('Mantle of the Zealot', function() {
    integration(function() {
        describe('Mantle of the Zealot\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        inPlay: ['grabber-jammer'],
                        hand: ['mantle-of-the-zealot']
                    },
                    player2: {
                        inPlay: []
                    }
                });
            });

            it('should allow using a non-house card', function() {
                this.player1.playUpgrade(this.mantleOfTheZealot, this.grabberJammer);
                this.player1.clickCard(this.grabberJammer);
                expect(this.player1).toHavePrompt('Grabber Jammer');
            });

            it('should not trigger under ABC circumstances', function() {

            });

            it('should have DEF effect on GHI', function() {

            });
        });
    });
});
