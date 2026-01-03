describe('Intentional Discharge', function () {
    describe("Intentional Discharge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['ironyx-vatminder', 'blypyp', 'pelf'],
                    hand: ['intentional-discharge']
                },
                player2: {
                    inPlay: ['john-smyth', 'bumpsy', 'troll']
                }
            });
        });

        it('should return a friendly creature to hand and ready a mars creature', function () {
            this.player1.play(this.intentionalDischarge);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.ironyxVatminder);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.ironyxVatminder);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.johnSmyth);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.blypyp);
            expect(this.ironyxVatminder.location).toBe('hand');
            expect(this.blypyp.exhausted).toBe(false);
        });

        it('should not ready a creature if no creature was returned to hand', function () {
            this.ironyxVatminder.ward();
            this.player1.play(this.intentionalDischarge);
            this.player1.clickCard(this.ironyxVatminder);
            this.expectReadyToTakeAction(this.player1);
            expect(this.ironyxVatminder.location).toBe('play area');
        });
    });
});
