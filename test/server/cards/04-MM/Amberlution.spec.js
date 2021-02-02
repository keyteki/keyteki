describe('Amberlution', function () {
    describe("Amberlution's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['æmberlution', 'senator-shrix', 'bigtwig', 'city-gates'],
                    inPlay: ['saurian-egg', 'gargantodon', 'paraguardian', 'imperial-road']
                },
                player2: {
                    amber: 1,
                    inPlay: ['tantadlin', 'chain-gang'],
                    hand: ['umbra', 'bulleteye', 'fogbank']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.æmberlution);
            });

            it('should destroy all creatures', function () {
                expect(this.player1.player.creaturesInPlay.length).toBe(0);
                expect(this.player2.player.creaturesInPlay.length).toBe(0);
            });

            it('should prompt player 1 to choose a creature', function () {
                expect(this.player1).toHavePrompt('Choose a creature to put into play');
                expect(this.player1).toBeAbleToSelect(this.senatorShrix);
                expect(this.player1).toBeAbleToSelect(this.bigtwig);
                expect(this.player1).toBeAbleToSelect(this.umbra);
                expect(this.player1).toBeAbleToSelect(this.bulleteye);
                expect(this.player1).not.toBeAbleToSelect(this.cityGates);
                expect(this.player1).not.toBeAbleToSelect(this.fogbank);
            });

            describe('and a creature is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.senatorShrix);
                    expect(this.senatorShrix.location).toBe('play area');
                    expect(this.player1.player.creaturesInPlay.length).toBe(1);
                    expect(this.player2.player.creaturesInPlay.length).toBe(0);
                });

                it('should prompt player 1 to choose a second creature', function () {
                    expect(this.player1).toHavePrompt('Choose a creature to put into play');
                    expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                    expect(this.player1).toBeAbleToSelect(this.bigtwig);
                    expect(this.player1).toBeAbleToSelect(this.umbra);
                    expect(this.player1).toBeAbleToSelect(this.bulleteye);
                    expect(this.player1).not.toBeAbleToSelect(this.cityGates);
                    expect(this.player1).not.toBeAbleToSelect(this.fogbank);
                });

                describe('and a second creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.bulleteye);
                        expect(this.bulleteye.location).toBe('play area');
                        expect(this.player1.player.creaturesInPlay.length).toBe(1);
                        expect(this.player2.player.creaturesInPlay.length).toBe(1);
                    });

                    it('should prompt player 1 to choose a third creature', function () {
                        expect(this.player1).toHavePrompt('Choose a creature to put into play');
                        expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
                        expect(this.player1).toBeAbleToSelect(this.bigtwig);
                        expect(this.player1).toBeAbleToSelect(this.umbra);
                        expect(this.player1).not.toBeAbleToSelect(this.bulleteye);
                        expect(this.player1).not.toBeAbleToSelect(this.cityGates);
                        expect(this.player1).not.toBeAbleToSelect(this.fogbank);
                    });

                    describe('and a third creature is selected', function () {
                        beforeEach(function () {
                            this.player1.clickCard(this.umbra);
                        });

                        it('should prompt player 1 to place a creature on the flank', function () {
                            expect(this.player1).toHavePrompt(
                                'Which flank do you want to place this creature on?'
                            );
                        });

                        describe('and a flank is selected', function () {
                            beforeEach(function () {
                                this.player1.clickPrompt('left');
                            });

                            it('should put third creature in play', function () {
                                expect(this.umbra.location).toBe('play area');
                                expect(this.player1.player.creaturesInPlay.length).toBe(1);
                                expect(this.player2.player.creaturesInPlay.length).toBe(2);
                            });

                            describe('and put the last creature in play without creature prompt', function () {
                                it('should prompt player 1 to place the next creature on the flank', function () {
                                    expect(this.player1).toHavePrompt(
                                        'Which flank do you want to place this creature on?'
                                    );
                                });

                                describe('and a flank is selected', function () {
                                    beforeEach(function () {
                                        this.player1.clickPrompt('left');
                                    });

                                    it('should put fourth creature in play', function () {
                                        expect(this.bigtwig.location).toBe('play area');
                                        expect(this.player1.player.creaturesInPlay.length).toBe(2);
                                        expect(this.player2.player.creaturesInPlay.length).toBe(2);
                                    });

                                    it('should put the creatures into play ready', function () {
                                        expect(this.senatorShrix.exhausted).toBe(false);
                                        expect(this.bigtwig.exhausted).toBe(false);
                                        expect(this.bulleteye.exhausted).toBe(false);
                                        expect(this.umbra.exhausted).toBe(false);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    describe("Amberlution's and gigantic ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    hand: ['ultra-gravitron', 'ultra-gravitron2', 'dextre']
                },
                player2: {
                    hand: [
                        'deusillus',
                        'deusillus',
                        'deusillus2',
                        'æmberlution',
                        'niffle-kong',
                        'senator-shrix',
                        'gebuk'
                    ],
                    inPlay: []
                }
            });

            this.deusillusBottom1 = this.player2.hand[0];
            this.deusillusBottom2 = this.player2.hand[1];

            this.player1.play(this.ultraGravitron2);
            expect(this.ultraGravitron2.location).toBe('play area');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
        });

        it('should prompt to play only 1 gigantic creature', function () {
            this.player2.play(this.æmberlution);
            expect(this.ultraGravitron.location).toBe('discard');
            expect(this.ultraGravitron2.location).toBe('discard');

            expect(this.player2).toBeAbleToSelect(this.deusillusBottom1);
            expect(this.player2).toBeAbleToSelect(this.deusillusBottom2);
            expect(this.player2).toBeAbleToSelect(this.deusillus2);
            expect(this.player2).toBeAbleToSelect(this.senatorShrix);
            expect(this.player2).toBeAbleToSelect(this.gebuk);
            expect(this.player2).toBeAbleToSelect(this.dextre);
            expect(this.player2).not.toBeAbleToSelect(this.ultraGravitron);
            expect(this.player2).not.toBeAbleToSelect(this.ultraGravitron);
            expect(this.player2).not.toBeAbleToSelect(this.niffleKong);

            expect(this.player2).toHavePrompt('Choose a creature to put into play');
            this.player2.clickCard(this.senatorShrix);
            expect(this.senatorShrix.location).toBe('play area');

            expect(this.player2).toHavePrompt('Choose a creature to put into play');
            this.player2.clickCard(this.gebuk);
            this.player2.clickPrompt('left');
            expect(this.gebuk.location).toBe('play area');

            expect(this.player2).toHavePrompt('Choose a creature to put into play');
            this.player2.clickCard(this.dextre);
            expect(this.dextre.location).toBe('play area');

            expect(this.player2).toHavePrompt('Choose a creature to put into play');
            this.player2.clickCard(this.deusillusBottom2);
            this.player2.clickPrompt('left');
            expect(this.deusillusBottom2.location).toBe('play area');
            expect(this.deusillusBottom2.composedPart).toBe(this.deusillus2);

            expect(this.player1).toHavePrompt('Choose which house you want to activate this turn');
        });
    });
});
