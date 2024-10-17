describe('Shatter Storm', function () {
    describe("Shatter Storm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'mars',
                    hand: ['shatter-storm']
                },
                player2: {
                    amber: 12,
                    inPlay: ['urchin']
                }
            });
        });

        it('should make the player lose all their amber, and the other player lose 3 times as much', function () {
            this.player1.play(this.shatterStorm);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        it('should make the player lose all their amber, and the other player lose 3 times as much', function () {
            this.player1.amber = 0;
            this.player1.play(this.shatterStorm);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(12);
        });

        it('should make the player lose all their amber, and the other player lose 3 times as much', function () {
            this.player1.amber = 4;
            this.player1.play(this.shatterStorm);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
        });
    });
});
