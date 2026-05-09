describe('Cutthroat Research', function () {
    describe("Cutthroat Research's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['cutthroat-research']
                },
                player2: {
                    amber: 8
                }
            });
        });

        it('should steal 2 amber if opponent has 8 or more amber', function () {
            this.player1.play(this.cutthroatResearch);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal amber if opponent has less than 8 amber', function () {
            this.player2.amber = 7;
            this.player1.play(this.cutthroatResearch);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
