describe('The Vaultkeeper', function () {
    describe("The Vaultkeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['phase-shift', 'bumpsy', 'dextre', 'urchin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['the-vaultkeeper']
                }
            });
            this.player1.play(this.phaseShift);
        });

        it('should not allow amber to be stolen', function () {
            this.player1.play(this.urchin);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
        });

        it('should allow amber to be captured or lost', function () {
            this.player1.play(this.dextre);
            expect(this.dextre.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            this.player1.play(this.bumpsy);
            expect(this.player2.amber).toBe(2);
        });
    });
});
