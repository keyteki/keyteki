describe('Scoop Up', function () {
    describe("Scoop Up's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['ironyx-vatminder', 'blypyp', 'pelf'],
                    hand: ['scoop-up']
                },
                player2: {
                    inPlay: ['john-smyth', 'bumpsy']
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
            this.player1.clickCard(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.ironyxVatminder);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
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
            this.player1.play(this.scoopUp);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.ironyxVatminder);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            this.player1.clickCard(this.pelf);
            expect(this.pelf.location).toBe('archives');
            expect(this.player1.archives).toContain(this.pelf);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
