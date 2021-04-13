describe('Sparkfist', function () {
    describe("Sparkfist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['sparkfist']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should steal 1A when fighting', function () {
            this.player1.fightWith(this.sparkfist, this.lamindra);
            expect(this.lamindra.exhausted).toBe(true);
            expect(this.lamindra.stunned).toBe(true);
        });
    });
});
