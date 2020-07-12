describe('Amberlution', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'untamed',
                hand: ['æmberlution', 'senator-shrix', 'bigtwig'],
                inPlay: ['saurian-egg', 'gargantodon', 'paraguardian', 'imperial-road']
            },
            player2: {
                amber: 1,
                inPlay: ['tantadlin', 'chain-gang'],
                hand: ['umbra', 'bulleteye']
            }
        });
    });

    describe('when played', function () {
        beforeEach(function () {
            this.player1.play(this.æmberlution);
        });

        it('should prompt player 1 to place a creature on the flank', function () {
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
        });

        describe('and a flank is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('left');
            });

            it('should prompt player 1 to place the next creature on the flank', function () {
                expect(this.player1).toHavePrompt(
                    'Which flank do you want to place this creature on?'
                );
            });

            describe('and a flank is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('left');
                });

                it("should prompt for the opponent's card", function () {
                    expect(this.player1).toHavePrompt(
                        'Which flank do you want to place this creature on?'
                    );
                });

                describe('and a flank is selected', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('left');
                    });

                    it("should prompt for the next opponent's card", function () {
                        expect(this.player1).toHavePrompt(
                            'Which flank do you want to place this creature on?'
                        );
                    });

                    describe('and another flank is selected', function () {
                        beforeEach(function () {
                            this.player1.clickPrompt('right');
                        });

                        it('should destroy all creatures except the ones just put into play', function () {
                            expect(this.player1.player.creaturesInPlay.length).toBe(2);
                            expect(this.player2.player.creaturesInPlay.length).toBe(2);
                        });

                        it('should put the creatures that were in hand into play', function () {
                            expect(this.senatorShrix.location).toBe('play area');
                            expect(this.umbra.location).toBe('play area');
                        });

                        it('should put the creatures into play ready', function () {
                            expect(this.senatorShrix.exhausted).toBe(false);
                            expect(this.umbra.exhausted).toBe(false);
                        });
                    });
                });
            });
        });
    });
});
