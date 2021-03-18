describe('Ostracize', function () {
    describe("Ostracize's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['tantadlin', 'ancient-bear'],
                    inPlay: ['pestergrove']
                },
                player2: {
                    amber: 2,
                    hand: ['lamindra', 'silvertooth']
                }
            });
        });

        it('own creatures should enter play enraged', function () {
            this.player1.play(this.tantadlin);
            this.player1.play(this.ancientBear);
            expect(this.tantadlin.enraged).toBe(true);
            expect(this.ancientBear.enraged).toBe(true);
        });

        it('enemy creatures should enter play enraged', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.lamindra);
            this.player2.play(this.silvertooth);
            expect(this.lamindra.enraged).toBe(true);
            expect(this.silvertooth.enraged).toBe(true);
            expect(this.silvertooth.exhausted).toBe(false);
        });
    });
});
