describe('Eclectic Ambrosius Evil Twin', function () {
    describe("Eclectic Ambrosius Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['eclectic-ambrosius-evil-twin', 'senator-shrix']
                },
                player2: {
                    inPlay: ['dust-imp', 'dew-faerie', 'ancient-bear']
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
    });
});
