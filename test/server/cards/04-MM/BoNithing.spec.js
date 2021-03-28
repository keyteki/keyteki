describe('bo-nithing', function () {
    describe("Bo Nithing's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['cxo-taber'],
                    hand: ['bo-nithing']
                },
                player2: {
                    amber: 4,
                    inPlay: ['umbra']
                }
            });
        });

        it('should steal 1 amber for one forged key', function () {
            this.player2.player.keys['blue'] = true;

            this.player1.play(this.boNithing);

            expect(this.player2.amber).toBe(3);
        });

        it('should steal 2 amber for 2 forged keys', function () {
            this.player2.player.keys['red'] = true;
            this.player2.player.keys['blue'] = true;

            this.player1.play(this.boNithing);

            expect(this.player2.amber).toBe(2);
        });
    });
});
