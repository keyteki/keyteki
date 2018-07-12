describe('Ethereal Dreamer', function() {
    integration(function() {
        describe('Ethereal Dreamer\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ethereal-dreamer']
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
