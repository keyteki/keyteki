xdescribe('Armadrone Evil Twin', function () {
    describe("Armadrone Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'logos',
                    inPlay: ['armadrone']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should steal 1A when fighting', function () {
            this.player1.fightWith(this.armadrone, this.lamindra);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
        });
    });
});
