describe('Covetous Idol', function () {
    describe("Covetous Idol's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    inPlay: ['covetous-idol'],
                    hand: ['urchin', 'hunting-witch']
                },
                player2: {
                    amber: 5,
                    inPlay: ['krump', 'dust-pixie']
                }
            });
        });

        it('should increase hand size when opponent has more amber', function () {
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(7);
        });

        it('should not increase hand size when opponent has less amber', function () {
            this.player1.amber = 6;
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(6);
        });
    });
});
