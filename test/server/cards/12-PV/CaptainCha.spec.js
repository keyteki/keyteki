describe('Captain Cha', function () {
    describe("Captain Cha's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['captain-cha'],
                    hand: ['flaxia']
                },
                player2: {
                    amber: 3,
                    inPlay: ['krump']
                }
            });
        });

        it('should steal 1 amber when reaping', function () {
            this.player1.reap(this.captainCha);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });
    });
});
