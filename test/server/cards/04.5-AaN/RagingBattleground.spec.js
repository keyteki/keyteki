describe('Raging Battleground', function() {
    integration(function() {
        describe('Raging Battleground\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: []
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
