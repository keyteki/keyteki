describe('Radix of Suffering', function () {
    describe("Radix of Suffering's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 1,
                    inPlay: ['radix-of-suffering']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should make opponent lose 1 amber when they have amber', function () {
            this.player1.useAction(this.radixOfSuffering);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.player.hand.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should draw 1 card when opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.useAction(this.radixOfSuffering);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.player.hand.length).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should work correctly when opponent has exactly 1 amber', function () {
            this.player2.amber = 1;
            this.player1.useAction(this.radixOfSuffering);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1.player.hand.length).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
