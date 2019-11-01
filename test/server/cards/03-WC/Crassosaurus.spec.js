fdescribe('Crassosaurus', function() {
    integration(function() {
        describe('when played', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 5,
                        house: 'saurian',
                        hand: ['crassosaurus']
                    },
                    player2: {
                        amber: 5,
                        inPlay: ['batdrone', 'dextre']
                    }
                });

                this.player1.play(this.crassosaurus);
            });

            it('should prompt for amber capture', function() {
                expect(this.player1).toHavePrompt('Choose how many to capture');
            });

            describe('and an option is selected', function() {
                beforeEach(function() {
                    this.player1.selectOption('1');
                });

                it('lala', function() {
                    expect(this.player1).toHavePrompt('asdasd');
                });
            });
        });
    });
});
