describe('Demonic Shelf', function () {
    describe("Demonic Shelf's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    inPlay: ['demonic-shelf', 'dew-faerie', 'dust-pixie']
                },
                player2: {
                    inPlay: ['rowdy-skald', 'troll']
                }
            });
        });

        it('should put a friendly creature from play under it', function () {
            this.player1.useAction(this.demonicShelf);
            expect(this.player1).not.toBeAbleToSelect(this.rowdySkald);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dewFaerie);
            expect(this.dewFaerie.location).toBe('under');
            expect(this.demonicShelf.childCards).toContain(this.dewFaerie);
        });

        it('should deal 3 damage to a creature for each card under it', function () {
            this.player1.useAction(this.demonicShelf);
            this.player1.clickCard(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.rowdySkald);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(3);
            this.expectReadyToTakeAction(this.player1);

            this.demonicShelf.exhausted = false;
            this.player1.useAction(this.demonicShelf);
            this.player1.clickCard(this.dustPixie);
            expect(this.demonicShelf.childCards.length).toBe(2);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.rowdySkald);
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.rowdySkald.tokens.damage).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should work with no friendly creatures', function () {
            this.player1.useAction(this.demonicShelf);
            this.player1.clickCard(this.dewFaerie);
            this.player1.clickCard(this.troll);
            this.demonicShelf.exhausted = false;
            this.player1.moveCard(this.dustPixie, 'discard');
            this.player1.useAction(this.demonicShelf);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(6);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
