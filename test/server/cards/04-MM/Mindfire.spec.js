describe('Mindfire', function () {
    describe('Mindfire', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['mindfire'],
                    amber: 3
                },
                player2: {
                    amber: 6,
                    hand: ['mab-the-mad', 'lamindra']
                }
            });
        });

        it('should steal nothing if opponent has an empty hand', function () {
            this.player2.player.hand = [];
            this.player1.play(this.mindfire);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(6);
        });

        it("should steal 1A due to card's amber bonus", function () {
            this.player2.moveCard(this.lamindra, 'discard');
            this.player1.play(this.mindfire);
            expect(this.mabTheMad.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
        });

        it("should steal 3A due to card's enhancements", function () {
            this.lamindra.cardData.enhancements = ['amber', 'draw', 'draw'];
            this.player2.moveCard(this.mabTheMad, 'discard');
            this.player1.play(this.mindfire);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(3);
        });
    });
});
