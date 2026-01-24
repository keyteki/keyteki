describe('5C077', function () {
    describe("5C077's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['5c077', 'armsmaster-molina']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });

            this['5c077'].tokens.power = 3;
        });

        describe('when it reaps and no other friendly creature in play', function () {
            beforeEach(function () {
                this.player1.moveCard(this.armsmasterMolina, 'discard');
                this.player1.reap(this['5c077']);
            });

            it('should prompt to add or remove power counter', function () {
                expect(this.player1).toHavePromptButton('Add a power counter');
                expect(this.player1).toHavePromptButton('Remove a power counter');
                expect(this.player1).toHavePromptButton('Done');
                expect(this.player1).not.toBeAbleToSelect(this['5c077']);
            });

            describe('and choose to add a power counter', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Add a power counter');
                });

                it('should add +1 power counter', function () {
                    expect(this.player1.amber).toBe(2);
                    expect(this['5c077'].exhausted).toBe(true);
                    expect(this['5c077'].powerCounters).toBe(4);
                    expect(this['5c077'].power).toBe(6);
                    this.player1.endTurn();
                });
            });

            describe('and choose to remove a power counter', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Remove a power counter');
                });

                it('should descrease power counters', function () {
                    expect(this.player1.amber).toBe(2);
                    expect(this['5c077'].exhausted).toBe(true);
                    expect(this['5c077'].powerCounters).toBe(2);
                    expect(this['5c077'].power).toBe(4);
                    this.player1.endTurn();
                });
            });

            describe('and choose Done', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Done');
                });

                it('should descrease power counters', function () {
                    expect(this.player1.amber).toBe(2);
                    expect(this['5c077'].exhausted).toBe(true);
                    expect(this['5c077'].powerCounters).toBe(3);
                    expect(this['5c077'].power).toBe(5);
                    this.player1.endTurn();
                });
            });
        });

        describe('when it reaps and no other friendly creature in play with same power', function () {
            beforeEach(function () {
                this.player1.reap(this['5c077']);
            });

            it('should prompt to add or remove power counter', function () {
                expect(this.player1).toHavePromptButton('Add a power counter');
                expect(this.player1).toHavePromptButton('Remove a power counter');
                expect(this.player1).toHavePromptButton('Done');
                expect(this.player1).not.toBeAbleToSelect(this['5c077']);
            });

            describe('and choose to add a power counter', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Add a power counter');
                });

                it('should add +1 power counter', function () {
                    expect(this.player1.amber).toBe(2);
                    expect(this['5c077'].exhausted).toBe(true);
                    expect(this['5c077'].powerCounters).toBe(4);
                    expect(this['5c077'].power).toBe(6);
                    this.player1.endTurn();
                });
            });

            describe('and choose to remove a power counter', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Remove a power counter');
                });

                it('should descrease power counters', function () {
                    expect(this.player1.amber).toBe(2);
                    expect(this['5c077'].exhausted).toBe(true);
                    expect(this['5c077'].powerCounters).toBe(2);
                    expect(this['5c077'].power).toBe(4);
                    this.player1.endTurn();
                });
            });

            describe('and choose Done', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Done');
                });

                it('should descrease power counters', function () {
                    expect(this.player1.amber).toBe(2);
                    expect(this['5c077'].exhausted).toBe(true);
                    expect(this['5c077'].powerCounters).toBe(3);
                    expect(this['5c077'].power).toBe(5);
                    this.player1.endTurn();
                });
            });
        });
    });

    describe("5C077's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['5c077', 'sci-officer-morpheus', 'securi-droid', 'calv-1n']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when it reaps', function () {
            beforeEach(function () {
                this.player1.reap(this.sciOfficerMorpheus);
                this.player1.reap(this['5c077']);
            });

            it('should prompt to use a friendly creature', function () {
                expect(this.player1.amber).toBe(3);
                expect(this.player1).toBeAbleToSelect(this.sciOfficerMorpheus);
                expect(this.player1).toBeAbleToSelect(this.calv1n);
                expect(this.player1).not.toBeAbleToSelect(this.securiDroid);
                expect(this.player1).not.toBeAbleToSelect(this['5c077']);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);
            });

            describe('after selecting a creature', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.calv1n);
                });

                it('should prompt to use it', function () {
                    expect(this.player1).toHavePromptButton('Fight with this creature');
                    expect(this.player1).toHavePromptButton('Reap with this creature');
                });

                describe('and choose to reap', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('Reap with this creature');
                    });

                    it('should gain the amber from reaping', function () {
                        expect(this.player1.amber).toBe(4);
                    });

                    it('should have a prompt to change power counters', function () {
                        expect(this.player1).toHavePromptButton('Add a power counter');
                        expect(this.player1).toHavePromptButton('Remove a power counter');
                        expect(this.player1).toHavePromptButton('Done');
                    });

                    it('should be able to choose to remove even if no counter is on it', function () {
                        this.player1.clickPrompt('Remove a power counter');
                        expect(this['5c077'].power).toBe(2);
                    });

                    it('should be able to Done the prompt', function () {
                        this.player1.clickPrompt('Done');
                        expect(this['5c077'].power).toBe(2);
                    });

                    describe('and choose to add power counter', function () {
                        beforeEach(function () {
                            this.player1.clickPrompt('Add a power counter');
                        });

                        it('should add +1 power counters', function () {
                            expect(this['5c077'].powerCounters).toBe(1);
                            expect(this['5c077'].power).toBe(3);
                            expect(this.player1).isReadyToTakeAction();
                        });

                        describe('and reap again', function () {
                            beforeEach(function () {
                                this.player1.endTurn();
                                this.player2.clickPrompt('shadows');
                                this.player2.endTurn();
                                this.player1.clickPrompt('staralliance');
                                this.player1.reap(this['5c077']);
                            });

                            it('should not prompt to use a friendly creature, if no other friendly creature is in play with same power', function () {
                                expect(this.player1.amber).toBe(5);
                                expect(this.player1).toHavePromptButton('Add a power counter');
                                expect(this.player1).toHavePromptButton('Remove a power counter');
                            });

                            describe('and choose to remove power counter', function () {
                                beforeEach(function () {
                                    this.player1.clickPrompt('Remove a power counter');
                                });

                                it('should remove its power counters', function () {
                                    expect(this['5c077'].powerCounters).toBe(0);
                                    expect(this['5c077'].power).toBe(2);
                                    expect(this.player1).isReadyToTakeAction();
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
