describe('Counterfeit Controversy', function () {
    describe("Counterfeit Controversy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['counterfeit-controversy']
                },
                player2: {}
            });
        });

        it('opponent loses half of their amber rounding down when they have more', function () {
            this.player1.amber = 1;
            this.player2.amber = 7;
            this.player1.play(this.counterfeitControversy);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if opponent does not have more amber', function () {
            this.player1.amber = 4;
            this.player2.amber = 5;
            this.player1.play(this.counterfeitControversy);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
