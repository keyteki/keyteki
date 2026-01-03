describe('Drumble', function () {
    describe("Drumble's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['drumble']
                },
                player2: {
                    amber: 7
                }
            });
        });

        it('should capture all opponent amber if they have 7 or more', function () {
            this.player1.play(this.drumble);
            expect(this.drumble.amber).toBe(7);
            expect(this.player2.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not capture amber if opponent has less than 7', function () {
            this.player2.amber = 6;
            this.player1.play(this.drumble);
            expect(this.drumble.amber).toBe(0);
            expect(this.player2.amber).toBe(6);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
