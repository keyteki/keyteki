describe('Forgive or Forget', function () {
    describe('when discards are empty', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['forgive-or-forget']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });

            this.player1.play(this.forgiveOrForget);
        });

        it('should not prompt', function () {
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe('when owner discard is empty', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['forgive-or-forget']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens'],
                    discard: ['lamindra', 'fidgit', 'troll']
                }
            });

            this.player1.play(this.forgiveOrForget);
        });

        it('should prompt to archive or purge', function () {
            expect(this.player1).toHavePromptButton('Archive 2 cards');
            expect(this.player1).toHavePromptButton('Purge up to 2 cards');
        });

        describe('when archive is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Archive 2 cards');
            });

            it('should not prompt for anything', function () {
                this.expectReadyToTakeAction(this.player1);
            });
        });

        describe('when purge is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Purge up to 2 cards');
                expect(this.player1).toHavePrompt('Select up to 2 cards from your discard');
                this.player1.clickPrompt('Done');
            });

            it("should be able to select opponent's cards", function () {
                expect(this.player1).toHavePrompt("Select up to 2 cards from opponent's discard");
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.fidgit);
                expect(this.player1).toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);
            });

            it('should be able to select no cards', function () {
                expect(this.player1).toHavePrompt("Select up to 2 cards from opponent's discard");
                this.player1.clickPrompt('Done');

                expect(this.lamindra.location).toBe('discard');
                expect(this.fidgit.location).toBe('discard');
                expect(this.troll.location).toBe('discard');

                this.expectReadyToTakeAction(this.player1);
            });

            it('should be able to select 1', function () {
                expect(this.player1).toHavePrompt("Select up to 2 cards from opponent's discard");
                this.player1.clickCard(this.lamindra);
                this.player1.clickPrompt('Done');

                expect(this.lamindra.location).toBe('purged');
                expect(this.fidgit.location).toBe('discard');
                expect(this.troll.location).toBe('discard');

                this.expectReadyToTakeAction(this.player1);
            });

            it('should be able to select up to 2', function () {
                expect(this.player1).toHavePrompt("Select up to 2 cards from opponent's discard");
                this.player1.clickCard(this.lamindra);
                this.player1.clickCard(this.fidgit);
                this.player1.clickPrompt('Done');

                expect(this.lamindra.location).toBe('purged');
                expect(this.fidgit.location).toBe('purged');
                expect(this.troll.location).toBe('discard');

                this.expectReadyToTakeAction(this.player1);
            });
        });
    });

    describe("when opponent's discard is empty", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['forgive-or-forget'],
                    discard: ['dextre', 'archimedes', 'detention-coil', 'matter-maker']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });

            this.player1.play(this.forgiveOrForget);
        });

        it('should prompt to archive or purge', function () {
            expect(this.player1).toHavePromptButton('Archive 2 cards');
            expect(this.player1).toHavePromptButton('Purge up to 2 cards');
        });

        describe('when purge is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Purge up to 2 cards');
            });

            it('should be able to select own cards', function () {
                expect(this.player1).toHavePrompt('Select up to 2 cards from your discard');
                expect(this.player1).toBeAbleToSelect(this.dextre);
                expect(this.player1).toBeAbleToSelect(this.archimedes);
                expect(this.player1).toBeAbleToSelect(this.detentionCoil);
                expect(this.player1).toBeAbleToSelect(this.matterMaker);
                expect(this.player1).not.toBeAbleToSelect(this.murkens);
            });

            it('should be able to select no cards', function () {
                expect(this.player1).toHavePrompt('Select up to 2 cards from your discard');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt("Select up to 2 cards from opponent's discard");
                this.player1.clickPrompt('Done');

                expect(this.dextre.location).toBe('discard');
                expect(this.detentionCoil.location).toBe('discard');
                expect(this.archimedes.location).toBe('discard');
                expect(this.matterMaker.location).toBe('discard');
            });

            it('should be able to select 1', function () {
                expect(this.player1).toHavePrompt('Select up to 2 cards from your discard');
                this.player1.clickCard(this.dextre);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt("Select up to 2 cards from opponent's discard");
                this.player1.clickPrompt('Done');

                expect(this.dextre.location).toBe('purged');
                expect(this.detentionCoil.location).toBe('discard');
                expect(this.archimedes.location).toBe('discard');
                expect(this.matterMaker.location).toBe('discard');
            });

            it('should be able to select up to 2', function () {
                expect(this.player1).toHavePrompt('Select up to 2 cards from your discard');
                this.player1.clickCard(this.dextre);
                this.player1.clickCard(this.archimedes);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt("Select up to 2 cards from opponent's discard");
                this.player1.clickPrompt('Done');

                expect(this.dextre.location).toBe('purged');
                expect(this.detentionCoil.location).toBe('discard');
                expect(this.archimedes.location).toBe('purged');
                expect(this.matterMaker.location).toBe('discard');
                this.player1.endTurn();
            });
        });
    });

    describe('when both discards are available', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['forgive-or-forget'],
                    discard: [
                        'dextre',
                        'archimedes',
                        'eureka',
                        'animator',
                        'causal-loop',
                        'access-denied',
                        'detention-coil',
                        'matter-maker'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens'],
                    discard: ['lamindra', 'fidgit', 'troll']
                }
            });

            this.player1.play(this.forgiveOrForget);
        });

        it('should prompt to archive or purge', function () {
            expect(this.player1).toHavePromptButton('Archive 2 cards');
            expect(this.player1).toHavePromptButton('Purge up to 2 cards');
        });

        describe('when archive is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Archive 2 cards');
            });

            it('should not be optional', function () {
                expect(this.player1).not.toHavePromptButton('Done');
            });

            it("should not be able to select opponent's cards", function () {
                expect(this.player1).not.toBeAbleToSelect(this.lamindra);
                expect(this.player1).not.toBeAbleToSelect(this.fidgit);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
            });

            it('must select two different type and archive the cards', function () {
                this.player1.clickCard(this.animator);
                expect(this.player1).not.toBeAbleToSelect(this.matterMaker);
                expect(this.player1).toBeAbleToSelect(this.dextre);
                expect(this.player1).toBeAbleToSelect(this.archimedes);
                expect(this.player1).toBeAbleToSelect(this.eureka);
                expect(this.player1).toBeAbleToSelect(this.causalLoop);
                expect(this.player1).toBeAbleToSelect(this.accessDenied);
                expect(this.player1).toBeAbleToSelect(this.detentionCoil);
                this.player1.clickCard(this.detentionCoil);
                expect(this.animator.location).toBe('archives');
                expect(this.detentionCoil.location).toBe('archives');
                expect(this.dextre.location).toBe('discard');
                expect(this.archimedes.location).toBe('discard');
                expect(this.eureka.location).toBe('discard');
                expect(this.causalLoop.location).toBe('discard');
                expect(this.matterMaker.location).toBe('discard');
                this.player1.endTurn();
            });
        });

        describe('when purge is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Purge up to 2 cards');
            });

            it('should be optional', function () {
                expect(this.player1).toHavePrompt('Select up to 2 cards from your discard');
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt("Select up to 2 cards from opponent's discard");
                this.player1.clickPrompt('Done');
                this.expectReadyToTakeAction(this.player1);
            });

            it('they purge owner and opponent cards when selected', function () {
                expect(this.player1).toHavePrompt('Select up to 2 cards from your discard');
                this.player1.clickCard(this.dextre);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt("Select up to 2 cards from opponent's discard");
                this.player1.clickCard(this.troll);
                this.player1.clickCard(this.lamindra);
                this.player1.clickPrompt('Done');
                expect(this.dextre.location).toBe('purged');
                expect(this.archimedes.location).toBe('discard');
                expect(this.lamindra.location).toBe('purged');
                expect(this.troll.location).toBe('purged');
                expect(this.fidgit.location).toBe('discard');
            });
        });
    });
});
