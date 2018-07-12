describe('Tainted Hero', function() {
    integration(function() {
        describe('Tainted Hero\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['tainted-hero']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.noMoreActions();
            });

            it('should trigger under XYZ circumstances', function() {

            });

            it('should not trigger under ABC circumstances', function() {

            });

            it('should have DEF effect on GHI', function() {

            });
        });
    });
});
