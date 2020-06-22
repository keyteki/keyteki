describe('Dark Faerie', function () {
    describe("Dark Faerie's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    inPlay: ['dark-faerie']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should gain 2 amber when fighting', function () {
            this.player1.fightWith(this.darkFaerie, this.lamindra);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
        });
    });
});
