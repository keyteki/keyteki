describe('Eclectic Ambrosius Evil Twin', function () {
    describe("Eclectic Ambrosius Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['eclectic-ambrosius-evil-twin', 'senator-shrix']
                },
                player2: {
                    inPlay: ['dust-imp', 'dew-faerie', 'ancient-bear'],
                    hand: ['de-animator', 'titan-librarian', 'wild-wormhole', 'mookling']
                }
            });
        });

        it('should place a ignorance counter on an enemy creature after reap', function () {
            this.player1.reap(this.eclecticAmbrosiusEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).not.toBeAbleToSelect(this.eclecticAmbrosiusEvilTwin);
            expect(this.player1).not.toBeAbleToSelect(this.senatorShrix);
            this.player1.clickCard(this.dewFaerie);
            expect(this.dewFaerie.tokens.ignorance).toBe(1);
            expect(this.dustImp.hasToken('ignorance')).toBe(false);
        });

        describe('after placing ignorance counter', function () {
            beforeEach(function () {
                this.player1.reap(this.eclecticAmbrosiusEvilTwin);
                this.player1.clickCard(this.dewFaerie);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
            });

            it('creature text should be blanked', function () {
                this.player2.reap(this.dewFaerie);
                expect(this.player2.amber).toBe(1);
            });

            it('creature should be blanked even if Ambrosius leaves play', function () {
                this.player2.fightWith(this.ancientBear, this.eclecticAmbrosiusEvilTwin);
                expect(this.eclecticAmbrosiusEvilTwin.location).toBe('discard');
                this.player2.reap(this.dewFaerie);
                expect(this.player2.amber).toBe(1);
            });
        });

        it('un-blanks the text box of a creature that becomes an artifact', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.playCreature('titan-librarian');
            this.player2.playCreature('de-animator');
            this.player2.clickCard(this.dewFaerie);
            this.player2.endTurn();
            expect(this.player2).toHavePrompt('Titan Librarian');
            expect(this.player2).toBeAbleToSelect(this.wildWormhole);
            expect(this.player2).toBeAbleToSelect(this.mookling);
            this.player2.clickCard(this.wildWormhole);

            // Now blank out Titan Librarian
            this.player1.clickPrompt('saurian');
            this.player1.reap(this.eclecticAmbrosiusEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.titanLibrarian);
            this.player1.clickCard(this.titanLibrarian);
            this.player1.endTurn();

            this.player2.clickPrompt('logos');
            // Don’t take archives
            this.player2.clickPrompt('No');
            this.player2.endTurn();
            expect(this.player2).not.toHavePrompt('Titan Librarian');

            this.player1.clickPrompt('saurian');
            this.player1.endTurn();

            this.player2.clickPrompt('logos');
            this.player2.clickPrompt('No');

            this.player2.reap(this.deAnimator);
            expect(this.player2).toHavePrompt('De-Animator');
            this.player2.clickCard(this.titanLibrarian);
            expect(this.titanLibrarian.tokens.ignorance).toBe(1);
            expect(this.titanLibrarian.tokens.mineralize).toBe(1);

            this.player2.endTurn();

            // Titan Librarian is no longer a creature, so EA doesn’t blank it
            // out. Also, can’t be on a flank because it’s an artifact, so its
            // ability goes off.
            expect(this.player2).toHavePrompt('Titan Librarian');
            this.player2.clickCard(this.mookling);

            expect(this.player1).toHavePrompt('House Choice');
        });
    });
});
