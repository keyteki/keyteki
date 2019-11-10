describe('Crassosaurus', function() {
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

            it('should prompt for amber capture from opponent', function() {
                expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            });

            describe('and an option is selected', function() {
                beforeEach(function() {
                    this.player1.selectOption(5);
                });

                it('it should prompt for capturing from own side', function() {
                    expect(this.player1).toHavePrompt('Choose how many to capture from own side');
                });

                describe('and an option is selected that takes the total to 10 or more', function() {
                    beforeEach(function() {
                        this.player1.selectOption(5);
                    });

                    it('should not purge crassosaurus', function() {
                        expect(this.crassosaurus.location).not.toBe('purged');
                    });

                    it('should capture from each side', function() {
                        expect(this.player1.amber).toBe(0);
                        expect(this.player2.amber).toBe(0);
                        expect(this.crassosaurus.tokens.amber).toBe(10);
                    });
                });

                describe('and an option is selected that takes the total to less than 10', function() {
                    beforeEach(function() {
                        this.player1.selectOption(2);
                    });

                    it('should purge crassosaurus', function() {
                        expect(this.crassosaurus.location).toBe('purged');
                    });

                    it('return amber', function() {
                        expect(this.player1.amber).toBe(3);
                        expect(this.player2.amber).toBe(7);
                    });
                });
            });
        });

        describe('when played', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 5,
                        house: 'saurian',
                        hand: ['crassosaurus']
                    },
                    player2: {
                        amber: 11,
                        inPlay: ['batdrone', 'dextre']
                    }
                });

                this.player1.play(this.crassosaurus);
            });

            it('should prompt for amber capture from opponent', function() {
                expect(this.player1).toHavePrompt('Choose how many to capture from opponent');
            });

            describe('and an option is selected', function() {
                beforeEach(function() {
                    this.player1.selectOption(10);
                });

                it('it NOT should prompt for capturing from own side', function() {
                    expect(this.player1).not.toHavePrompt('Choose how many to capture from own side');
                });
            });
        });
    });
});
