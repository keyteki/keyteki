describe('Pip the Pilferer', function () {
    describe("Pip the Pilferer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 0,
                    hand: ['pip-the-pilferer']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('steals 2 when opponent has more keys', function () {
            this.player2.player.keys.red = true;
            this.player1.play(this.pipThePilferer);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 2 when opponent has equal keys', function () {
            this.player1.play(this.pipThePilferer);
            expect(this.pipThePilferer.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 2 when player has more keys', function () {
            this.player1.player.keys.red = true;
            this.player1.play(this.pipThePilferer);
            expect(this.pipThePilferer.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
