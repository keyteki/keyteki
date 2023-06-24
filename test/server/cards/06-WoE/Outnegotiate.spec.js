describe('Outnegotiate', function () {
    describe('Outnegotiate', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'ekwidon',
                    hand: ['outnegotiate'],
                    discard: ['pelf']
                },
                player2: {
                    amber: 6,
                    discard: ['mab-the-mad', 'lamindra']
                }
            });
        });

        it('should steal nothing if opponent has an empty discard', function () {
            this.player2.player.discard = [];
            this.player1.play(this.outnegotiate);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(6);
        });

        it('should steal nothing if the card has no bonus icon', function () {
            this.player1.play(this.outnegotiate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.mabTheMad);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            this.player1.clickCard(this.lamindra);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(6);
            expect(this.lamindra.location).toBe('deck');
        });

        it('should steal if the card has a bonus amber', function () {
            this.player1.play(this.outnegotiate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.mabTheMad);
            this.player1.clickCard(this.mabTheMad);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(5);
            expect(this.mabTheMad.location).toBe('deck');
        });

        it('should steal only for bonus amber if the card multiple enhancement types', function () {
            this.lamindra.enhancements = ['amber', 'draw', 'draw'];
            this.player1.play(this.outnegotiate);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.mabTheMad);
            this.player1.clickCard(this.lamindra);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(5);
            expect(this.lamindra.location).toBe('deck');
        });
    });
});
