describe('Subtle Otto', function () {
    describe("Subtle Otto's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['mooncurser', 'tantadlin'],
                    hand: ['subtle-otto', 'knoxx', 'knoxx', 'knoxx', 'knoxx', 'knoxx']
                },
                player2: {
                    inPlay: ['lamindra', 'krump'],
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });
        });

        it("Discard card from opponent's hand", function () {
            this.player1.play(this.subtleOtto);
            expect(this.player1.hand.length).toBe(5);
            expect(this.player2.hand.length).toBe(5);
        });
    });
});
