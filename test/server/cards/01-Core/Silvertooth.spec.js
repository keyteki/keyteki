describe('Silvertooth', function () {
    describe("Silvertooth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['silvertooth'],
                    inPlay: ['lamindra', 'urchin']
                },
                player2: {
                    inPlay: ['ancient-bear', 'duskwitch', 'niffle-ape']
                }
            });

            this.player1.play(this.silvertooth);
        });

        it('should enter play ready', function () {
            expect(this.silvertooth.location).toBe('play area');
            expect(this.silvertooth.exhausted).toBe(false);
            this.player1.endTurn();
        });

        it('should be able to use it', function () {
            this.player1.reap(this.silvertooth);
            expect(this.player1.amber).toBe(1);
        });
    });
});
