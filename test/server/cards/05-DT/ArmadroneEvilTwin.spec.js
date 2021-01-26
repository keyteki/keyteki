describe('Armadrone Evil Twin', function () {
    describe("Armadrone Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'logos',
                    inPlay: ['armadrone-evil-twin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should steal 2A when fighting', function () {
            this.player1.fightWith(this.armadroneEvilTwin, this.lamindra);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(2);
        });
    });
});
