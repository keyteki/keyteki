describe('Brend the Fanatic', function () {
    describe("Brend the Fanatic's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['brend-the-fanatic', 'life-for-a-life']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should give opponent 1 amber on play', function () {
            this.player1.play(this.brendTheFanatic);
            expect(this.player2.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal 3 amber when destroyed', function () {
            this.player1.play(this.brendTheFanatic);
            this.player1.play(this.lifeForALife);
            this.player1.clickCard(this.brendTheFanatic);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
