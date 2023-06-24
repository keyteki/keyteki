describe('Frost Giant', function () {
    describe("Frost Giant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['frost-giant', 'bumpsy'],
                    hand: ['anger']
                },
                player2: {
                    inPlay: ['toad']
                }
            });
        });

        it('should not ready during the ready phase', function () {
            this.player1.fightWith(this.frostGiant, this.toad);
            expect(this.toad.location).toBe('discard');
            this.player1.endTurn();
            expect(this.frostGiant.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(false);
        });

        it('can be readied with effects', function () {
            this.player1.fightWith(this.frostGiant, this.toad);
            expect(this.toad.location).toBe('discard');
            this.player1.play(this.anger);
            expect(this.player1).toBeAbleToSelect(this.frostGiant);
            this.player1.clickCard(this.frostGiant);
            expect(this.frostGiant.exhausted).toBe(false);
            this.player1.endTurn();
        });
    });
});
