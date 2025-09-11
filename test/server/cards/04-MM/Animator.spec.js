describe('Animator', function () {
    describe('when action ability is triggered', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['legatus-raptor', 'animator', 'city-gates', 'hapsis'],
                    hand: ['discombobulator']
                },
                player2: {
                    inPlay: ['troll', 'lash-of-broken-dreams']
                }
            });

            this.player1.useAction(this.animator);
        });

        it('should prompt which artifact to target', function () {
            expect(this.player1).toHavePrompt('Choose a artifact');
            expect(this.player1).toBeAbleToSelect(this.animator);
            expect(this.player1).toBeAbleToSelect(this.cityGates);
            expect(this.player1).toBeAbleToSelect(this.lashOfBrokenDreams);
            expect(this.player1).not.toBeAbleToSelect(this.legatusRaptor);
        });

        describe('when owner artifact is selected', function () {
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

                describe('when turn is finished', function () {
                    beforeEach(function () {
                        this.player1.endTurn();
                    });

                    it('should become an artifact again', function () {
                        expect(this.cityGates.type).toBe('artifact');
                        expect(this.cityGates.hasHouse('logos')).toBe(false);
                    });
                });
            });
        });

        describe('when itself is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.animator);
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
                    expect(this.animator.type).toBe('creature');
                });

                it('should give the artifact 3 power', function () {
                    expect(this.animator.power).toBe(3);
                });

                it('should make the artifact be of the current house', function () {
                    expect(this.animator.hasHouse('logos')).toBe(true);
                });

                it('should be exhausted', function () {
                    expect(this.animator.exhausted).toBe(true);
                });

                describe('when turn is finished', function () {
                    beforeEach(function () {
                        this.player1.endTurn();
                    });

                    it('should become an artifact again', function () {
                        expect(this.animator.type).toBe('artifact');
                        expect(this.animator.hasHouse('logos')).toBe(true);
                    });
                });
            });
        });

        describe('when enemy artifact is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.lashOfBrokenDreams);
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
                    expect(this.lashOfBrokenDreams.type).toBe('creature');
                });

                it('should give the artifact 3 power', function () {
                    expect(this.lashOfBrokenDreams.power).toBe(3);
                });

                it('should make the artifact be of the current house', function () {
                    expect(this.lashOfBrokenDreams.hasHouse('logos')).toBe(true);
                });

                describe('when destroyed in a fight', function () {
                    beforeEach(function () {
                        this.player1.fightWith(this.hapsis, this.lashOfBrokenDreams);
                    });

                    it('should become an artifact again', function () {
                        expect(this.hapsis.tokens.damage).toBe(3);
                        expect(this.lashOfBrokenDreams.type).toBe('artifact');
                        expect(this.lashOfBrokenDreams.location).toBe('discard');
                        expect(this.lashOfBrokenDreams.hasHouse('logos')).toBe(false);
                    });
                });

                describe('when an upgrade is attached to it', function () {
                    beforeEach(function () {
                        this.player1.playUpgrade(this.discombobulator, this.lashOfBrokenDreams);
                    });

                    describe('when destroyed in a fight', function () {
                        beforeEach(function () {
                            this.player1.fightWith(this.hapsis, this.lashOfBrokenDreams);
                        });

                        it('should discard the upgrade', function () {
                            expect(this.hapsis.tokens.damage).toBe(3);
                            expect(this.lashOfBrokenDreams.type).toBe('artifact');
                            expect(this.lashOfBrokenDreams.location).toBe('discard');
                            expect(this.discombobulator.location).toBe('discard');
                            expect(this.discombobulator.controller).toBe(this.player1.player);
                        });
                    });

                    describe('when turn is finished', function () {
                        beforeEach(function () {
                            this.player1.endTurn();
                        });

                        it('should keep the upgrade attached', function () {
                            expect(this.discombobulator.location).toBe('play area');
                            expect(this.discombobulator.parent).toBe(this.lashOfBrokenDreams);
                        });
                    });
                });

                describe('when turn is finished', function () {
                    beforeEach(function () {
                        this.player1.endTurn();
                    });

                    it('should become an artifact again', function () {
                        expect(this.lashOfBrokenDreams.type).toBe('artifact');
                        expect(this.lashOfBrokenDreams.hasHouse('logos')).toBe(false);
                    });
                });
            });
        });
    });
});
