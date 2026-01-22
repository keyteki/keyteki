describe('Screechbomb', function () {
    describe("Screechbomb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['screechbomb']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should sacrifice itself and make opponent lose 2 amber', function () {
            this.player1.useOmni(this.screechbomb);
            expect(this.screechbomb.location).toBe('discard');
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make opponent lose only the amber they have', function () {
            this.player2.amber = 1;
            this.player1.useOmni(this.screechbomb);
            expect(this.screechbomb.location).toBe('discard');
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
