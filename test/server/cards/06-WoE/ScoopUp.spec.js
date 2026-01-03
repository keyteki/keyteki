describe('Scoop Up', function () {
    describe("Scoop Up's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['ironyx-vatminder', 'blypyp', 'pelf'],
                    hand: ['scoop-up', 'hypnobeam']
                },
                player2: {
                    inPlay: ['john-smyth', 'bumpsy', 'troll']
                }
            });
        });

        it('should archive a friendly and an enemy non-Mars creature', function () {
            this.player1.play(this.scoopUp);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.ironyxVatminder);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.ironyxVatminder);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.bumpsy);
            expect(this.pelf.location).toBe('archives');
            expect(this.player1.archives).toContain(this.pelf);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1.archives).toContain(this.bumpsy);
        });

        it('should work with no friendly Mars creatures', function () {
            this.pelf.location = 'discard';
            this.player1.play(this.scoopUp);
            expect(this.player1).not.toBeAbleToSelect(this.ironyxVatminder);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1.archives).toContain(this.bumpsy);
        });

        it('should work with no enemy Mars creatures', function () {
            this.bumpsy.location = 'discard';
            this.troll.location = 'discard';
            this.player1.play(this.scoopUp);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.ironyxVatminder);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            this.player1.clickCard(this.pelf);
            expect(this.pelf.location).toBe('archives');
            expect(this.player1.archives).toContain(this.pelf);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should put opponent-owned friendly creatures in our archive', function () {
            this.player1.play(this.hypnobeam);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Left');
            this.player1.play(this.scoopUp);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickCard(this.troll);
            expect(this.bumpsy.location).toBe('archives');
            expect(this.player1.archives).toContain(this.bumpsy);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.archives).toContain(this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('Mars');
            this.player1.clickPrompt('Yes');
            expect(this.bumpsy.location).toBe('hand');
            expect(this.player2.hand).toContain(this.bumpsy);
            expect(this.troll.location).toBe('hand');
            expect(this.player2.hand).toContain(this.troll);
        });
    });
});
