describe('5C077 Evil Twin', function () {
    describe("5C077 Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['5c077-evil-twin', 'armsmaster-molina']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });

            this['5c077EvilTwin'].powerCounters = 3;
        });

        describe('when it reaps and no other creature in play with same power', function () {
            beforeEach(function () {
                this.player1.reap(this['5c077EvilTwin']);
            });

            it('should prompt to add or remove power counter', function () {
                expect(this.player1).toHavePromptButton('Add a power counter');
                expect(this.player1).toHavePromptButton('Remove a power counter');
                expect(this.player1).toHavePromptButton('Done');
            });

            describe('and choose to add a power counter', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Add a power counter');
                });

                it('should add +1 power counter', function () {
                    expect(this['5c077EvilTwin'].powerCounters).toBe(4);
                    expect(this['5c077EvilTwin'].power).toBe(6);
                });
            });

            describe('and choose to remove a power counter', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Remove a power counter');
                });

                it('should descrease power counters', function () {
                    expect(this['5c077EvilTwin'].powerCounters).toBe(2);
                    expect(this['5c077EvilTwin'].power).toBe(4);
                });
            });

            describe('and choose to Done', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Done');
                });

                it('should descrease power counters', function () {
                    expect(this['5c077EvilTwin'].powerCounters).toBe(3);
                    expect(this['5c077EvilTwin'].power).toBe(5);
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
                    inPlay: ['5c077-evil-twin', 'sci-officer-morpheus', 'securi-droid', 'calv-1n']
                },
                player2: {
                    amber: 4,
                    inPlay: ['faygin', 'fidgit']
                }
            });
        });

        describe('when it reaps', function () {
            beforeEach(function () {
                this.player1.reap(this['5c077EvilTwin']);
            });

            it('should prompt to destroy a creature', function () {
                expect(this.player1).toBeAbleToSelect(this.sciOfficerMorpheus);
                expect(this.player1).toBeAbleToSelect(this.calv1n);
                expect(this.player1).toBeAbleToSelect(this.fidgit);
                expect(this.player1).not.toBeAbleToSelect(this.securiDroid);
                expect(this.player1).not.toBeAbleToSelect(this['5c077EvilTwin']);
                expect(this.player1).not.toBeAbleToSelect(this.faygin);
            });

            describe('after selecting a creature', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.fidgit);
                });

                it('should be destroyed', function () {
                    expect(this.fidgit.location).toBe('discard');
                });

                it('should have a prompt to change power counters', function () {
                    expect(this.player1).toHavePromptButton('Add a power counter');
                    expect(this.player1).toHavePromptButton('Remove a power counter');
                    expect(this.player1).toHavePromptButton('Done');
                });

                it('should be able to choose to remove even if no counter is on it', function () {
                    this.player1.clickPrompt('Remove a power counter');
                    expect(this['5c077EvilTwin'].power).toBe(2);
                });

                it('should be able to Done the prompt', function () {
                    this.player1.clickPrompt('Done');
                    expect(this['5c077EvilTwin'].power).toBe(2);
                });

                describe('and choose to add power counter', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('Add a power counter');
                    });

                    it('should add +1 power counters', function () {
                        expect(this['5c077EvilTwin'].powerCounters).toBe(1);
                        expect(this['5c077EvilTwin'].power).toBe(3);
                        expect(this.player1).isReadyToTakeAction();
                    });

                    describe('and reap again', function () {
                        beforeEach(function () {
                            this.player1.endTurn();
                            this.player2.clickPrompt('shadows');
                            this.player2.endTurn();
                            this.player1.clickPrompt('staralliance');
                            this.player1.reap(this['5c077EvilTwin']);
                        });

                        it('should prompt to destroy a creature with the new power', function () {
                            expect(this.player1).not.toBeAbleToSelect(this.sciOfficerMorpheus);
                            expect(this.player1).not.toBeAbleToSelect(this.calv1n);
                            expect(this.player1).not.toBeAbleToSelect(this.fidgit);
                            expect(this.player1).not.toBeAbleToSelect(this.securiDroid);
                            expect(this.player1).not.toBeAbleToSelect(this['5c077EvilTwin']);
                            expect(this.player1).toBeAbleToSelect(this.faygin);
                        });
                    });
                });
            });
        });
    });
});
