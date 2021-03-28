describe('Animator', function () {
    describe('when action ability is triggered', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['legatus-raptor', 'mooncurser', 'animator', 'city-gates']
                },
                player2: {
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });

            this.player1.useAction(this.animator);
        });

        it('should prompt which artifact to target', function () {
            expect(this.player1).toHavePrompt('Choose a artifact');
            expect(this.player1).toBeAbleToSelect(this.cityGates);
            expect(this.player1).not.toBeAbleToSelect(this.legatusRaptor);
        });

        describe('when an artifact is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.cityGates);
            });

            it('should prompt which flank to put the artifact on', function () {
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
            });

            describe('when a flank is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Left');
                });

                it('should consider the artifact to be a creature', function () {
                    expect(this.cityGates.type).toBe('creature');
                });

                it('should give the artifact 3 power', function () {
                    expect(this.cityGates.power).toBe(3);
                });

                it('should make the artifact be of the current house', function () {
                    expect(this.cityGates.hasHouse('logos')).toBe(true);
                });
            });
        });
    });
});
