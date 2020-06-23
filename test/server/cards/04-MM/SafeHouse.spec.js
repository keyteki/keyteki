describe('Safe House', function () {
    describe("Safe House's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['lamindra'],
                    inPlay: ['safe-house', 'sinder', 'subtle-otto', 'ember-imp']
                },
                player2: {
                    inPlay: ['shooler']
                }
            });
        });

        it('should archive a friendly creature', function () {
            this.player1.useAction(this.safeHouse);
            expect(this.player1).toBeAbleToSelect(this.sinder);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.subtleOtto);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.safeHouse);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.sinder);
            expect(this.sinder.location).toBe('archives');
        });
    });
});
