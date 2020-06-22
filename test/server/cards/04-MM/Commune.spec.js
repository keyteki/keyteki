describe('Commune', function () {
    describe("Commune's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['flaxia'],
                    hand: ['commune'],
                    amber: 1
                },
                player2: {
                    amber: 1,
                    inPlay: ['tantadlin']
                }
            });
        });

        it('should lose all their amber and gain 4A', function () {
            this.player1.play(this.commune);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
        });
    });
});
