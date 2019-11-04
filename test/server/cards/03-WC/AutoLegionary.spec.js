describe('Auto-Legionary', function() {
    integration(function() {
        describe('when action ability is triggered', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'saurian',
                        inPlay: ['legatus-raptor', 'mooncurser', 'tantadlin', 'auto-legionary']
                    },
                    player2: {
                        hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                    }
                });

                this.player1.useAction(this.autoLegionary);
            });

            it('should prompt which flank to put the artifact on', function() {
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
            });

            describe('when a flank is selected', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Left');
                });

                it('should consider the artifact to be a creature', function() {
                    expect(this.autoLegionary.type).toBe('creature');
                });

                it('should give the artifact 5 power', function() {
                    expect(this.autoLegionary.power).toBe(5);
                });
            });
        });
    });
});
