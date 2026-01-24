describe('Staunch Knight', function () {
    describe("Staunch Knight's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['commander-remiel', 'staunch-knight'],
                    hand: ['jehu-the-bureaucrat']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should have +2 power when on a flank', function () {
            expect(this.staunchKnight.power).toBe(6);
            expect(this.staunchKnight.armor).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not have +2 power when not on a flank', function () {
            this.player1.playCreature(this.jehuTheBureaucrat);
            expect(this.staunchKnight.power).toBe(4);
            expect(this.staunchKnight.armor).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
