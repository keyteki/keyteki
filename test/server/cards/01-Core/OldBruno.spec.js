describe('Old Bruno', function () {
    describe("Old Bruno's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['old-bruno']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should capture 3 amber on play', function () {
            this.player1.playCreature(this.oldBruno);
            expect(this.oldBruno.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should capture less amber if opponent has less than 3', function () {
            this.player2.amber = 2;
            this.player1.playCreature(this.oldBruno);
            expect(this.oldBruno.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
