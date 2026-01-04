describe('Priest', function () {
    describe("Priest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'unfathomable',
                    token: 'priest',
                    inPlay: ['priest:timoti-the-dammed', 'kelpminder']
                },
                player2: {
                    amber: 1,
                    token: 'grumpus',
                    inPlay: ['lupo-the-scarred', 'pelf'],
                    hand: ['key-charge']
                }
            });
        });

        it('should exhaust opposing creature', function () {
            let priest1 = this.player1.inPlay[0];
            this.player1.useAction(priest1);
            expect(priest1.isToken()).toBe(true);
            expect(this.player1).toBeAbleToSelect(this.lupoTheScarred);
            expect(this.player1).not.toBeAbleToSelect(this.kelpminder);
            this.player1.clickCard(this.lupoTheScarred);
            expect(this.lupoTheScarred.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
