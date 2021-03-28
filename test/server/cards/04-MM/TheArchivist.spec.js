describe('The Archivist', function () {
    describe("The Archivist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['ancient-bear'],
                    hand: ['archimedes', 'the-archivist', 'causal-loop'],
                    archives: ['dextre', 'lamindra', 'experimental-therapy', 'borrow']
                },
                player2: {
                    amber: 1,
                    inPlay: ['shooler'],
                    archives: ['gub']
                }
            });
        });

        it('should be visible in archives', function () {
            expect(this.theArchivist.getSummary(this.player1.player).facedown).toBe(false);
            expect(this.theArchivist.getSummary(this.player2.player).facedown).toBe(true);

            this.player1.play(this.theArchivist);
            expect(this.theArchivist.getSummary(this.player1.player).facedown).toBe(false);
            expect(this.theArchivist.getSummary(this.player2.player).facedown).toBe(false);

            this.player1.player.moveCard(this.theArchivist, 'deck');
            expect(this.theArchivist.getSummary(this.player1.player).facedown).toBe(false);
            expect(this.theArchivist.getSummary(this.player2.player).facedown).toBe(true);

            this.player1.player.moveCard(this.theArchivist, 'purged');
            expect(this.theArchivist.getSummary(this.player1.player).facedown).toBe(false);
            expect(this.theArchivist.getSummary(this.player2.player).facedown).toBe(false);

            this.player1.player.moveCard(this.theArchivist, 'discard');
            expect(this.theArchivist.getSummary(this.player1.player).facedown).toBe(false);
            expect(this.theArchivist.getSummary(this.player2.player).facedown).toBe(false);

            this.player1.player.moveCard(this.theArchivist, 'archives');
            expect(this.dextre.getSummary(this.player1.player).facedown).toBe(false);
            expect(this.theArchivist.getSummary(this.player1.player).facedown).toBe(false);
            expect(this.dextre.getSummary(this.player2.player).facedown).toBe(true);
            expect(this.theArchivist.getSummary(this.player2.player).facedown).toBe(false);

            this.player1.player.moveCard(this.theArchivist, 'hand');
            expect(this.theArchivist.getSummary(this.player1.player).facedown).toBe(false);
            expect(this.theArchivist.getSummary(this.player2.player).facedown).toBe(true);
        });

        it('should not offer to choose cards from archives if in hand', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.player2).toHavePrompt(
                'Do you wish to take all the cards in archives into your hand?'
            );
            this.player2.clickPrompt('No');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this.player1).toHavePrompt(
                'Do you wish to take all the cards in archives into your hand?'
            );
        });

        it('should not offer to choose cards from archives if in play area', function () {
            this.player1.play(this.theArchivist);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.player2).toHavePrompt(
                'Do you wish to take all the cards in archives into your hand?'
            );
            this.player2.clickPrompt('No');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this.player1).toHavePrompt(
                'Do you wish to take all the cards in archives into your hand?'
            );
        });

        it('should not offer to choose cards from archives if in discard', function () {
            this.player1.moveCard(this.theArchivist, 'discard');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            expect(this.player2).toHavePrompt(
                'Do you wish to take all the cards in archives into your hand?'
            );
            this.player2.clickPrompt('No');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            expect(this.player1).toHavePrompt(
                'Do you wish to take all the cards in archives into your hand?'
            );
        });

        describe('while in archive', function () {
            beforeEach(function () {
                this.player1.play(this.causalLoop);
                this.player1.clickCard(this.theArchivist);
                this.player1.endTurn();
                this.player2.clickPrompt('dis');
                expect(this.player2).toHavePrompt(
                    'Do you wish to take all the cards in archives into your hand?'
                );
                this.player2.clickPrompt('No');
                this.player2.endTurn();
                this.player1.clickPrompt('logos');
            });

            it('should offer to choose cards', function () {
                expect(this.player1).toHavePrompt(
                    'Do you wish to take cards in archives into your hand?'
                );
            });

            it('should have an option to decline', function () {
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');

                expect(this.theArchivist.location).toBe('archives');
                expect(this.causalLoop.location).toBe('archives');
                expect(this.dextre.location).toBe('archives');
                expect(this.lamindra.location).toBe('archives');
                expect(this.experimentalTherapy.location).toBe('archives');
                expect(this.borrow.location).toBe('archives');
            });

            it('should have an All Cards button', function () {
                expect(this.player1).toHavePromptButton('All Cards');
                this.player1.clickPrompt('All Cards');

                expect(this.theArchivist.location).toBe('hand');
                expect(this.causalLoop.location).toBe('hand');
                expect(this.dextre.location).toBe('hand');
                expect(this.lamindra.location).toBe('hand');
                expect(this.experimentalTherapy.location).toBe('hand');
                expect(this.borrow.location).toBe('hand');
                expect(this.archimedes.location).toBe('hand');
                expect(this.ancientBear.location).toBe('play area');
            });

            it('should be able to select a few cards', function () {
                expect(this.player1).toBeAbleToSelect(this.theArchivist);
                expect(this.player1).toBeAbleToSelect(this.causalLoop);
                expect(this.player1).toBeAbleToSelect(this.dextre);
                expect(this.player1).toBeAbleToSelect(this.lamindra);
                expect(this.player1).toBeAbleToSelect(this.experimentalTherapy);
                expect(this.player1).toBeAbleToSelect(this.borrow);

                expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
                expect(this.player1).not.toBeAbleToSelect(this.archimedes);
                expect(this.player1).not.toBeAbleToSelect(this.gub);
                expect(this.player1).not.toBeAbleToSelect(this.shooler);
            });

            it('should move only selected cards to hand', function () {
                this.player1.clickCard(this.theArchivist);
                this.player1.clickCard(this.causalLoop);
                this.player1.clickCard(this.dextre);
                this.player1.clickCard(this.experimentalTherapy);
                this.player1.clickPrompt('Done');

                expect(this.theArchivist.location).toBe('hand');
                expect(this.causalLoop.location).toBe('hand');
                expect(this.dextre.location).toBe('hand');
                expect(this.lamindra.location).toBe('archives');
                expect(this.experimentalTherapy.location).toBe('hand');
                expect(this.borrow.location).toBe('archives');
                expect(this.archimedes.location).toBe('hand');
                expect(this.ancientBear.location).toBe('play area');
            });
        });
    });
});
