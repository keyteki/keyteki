describe('Fathomshare', function () {
    describe("Fathomshare's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['fathomshare'],
                    inPlay: ['urchin', 'silvertooth']
                },
                player2: {
                    amber: 7
                }
            });
        });

        it("captures half of opponent's amber rounding down distributed among friendly creatures", function () {
            this.player1.play(this.fathomshare);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.silvertooth);
            this.player1.clickCard(this.urchin);
            const total = this.urchin.amber + this.silvertooth.amber;
            expect(total).toBe(3);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if opponent has fewer than 2 amber', function () {
            this.player2.amber = 1;
            this.player1.play(this.fathomshare);
            expect(this.urchin.amber).toBe(0);
            expect(this.silvertooth.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
