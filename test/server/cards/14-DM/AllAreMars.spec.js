describe('All Are Mars', function () {
    describe('All Are Mars action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['all-are-mars', 'john-smyth']
                }
            });
        });

        it('readies and uses a friendly creature', function () {
            this.johnSmyth.exhausted = true;
            this.player1.useAction(this.allAreMars);
            expect(this.player1).toBeAbleToSelect(this.johnSmyth);
            this.player1.clickCard(this.johnSmyth);
            // creature reaped (gained amber)
            expect(this.johnSmyth.exhausted).toBe(true);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
