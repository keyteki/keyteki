describe('Deimos Burst', function () {
    describe("Deimos Burst's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    inPlay: ['blypyp', 'troll', 'rowdy-skald', 'future-booster', 'airlock'],
                    hand: ['deimos-burst']
                },
                player2: {
                    inPlay: ['com-officer-palik']
                }
            });
        });

        it('should destroy all friendly flank creatures and artifacts, and gain 1 amber for each', function () {
            this.player1.play(this.deimosBurst);
            expect(this.blypyp.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.rowdySkald.location).toBe('discard');
            expect(this.futureBooster.location).toBe('discard');
            expect(this.airlock.location).toBe('discard');
            expect(this.comOfficerPalik.location).toBe('play area');
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not count wards', function () {
            this.blypyp.ward();
            this.player1.play(this.deimosBurst);
            expect(this.blypyp.location).toBe('play area');
            expect(this.blypyp.warded).toBe(false);
            expect(this.troll.location).toBe('play area');
            expect(this.rowdySkald.location).toBe('discard');
            expect(this.futureBooster.location).toBe('discard');
            expect(this.airlock.location).toBe('discard');
            expect(this.comOfficerPalik.location).toBe('play area');
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
