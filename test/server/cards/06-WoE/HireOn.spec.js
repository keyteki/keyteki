describe('Hire On', function () {
    describe("Hire On's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'ekwidon',
                    token: 'grumpus',
                    hand: ['hire-on']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll']
                }
            });
        });

        it('should not archive if there is not 6 amber total', function () {
            this.player1.play(this.hireOn);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.hireOn.location).toBe('discard');
        });

        it('should archive if there is at least 6 amber', function () {
            this.player2.amber = 2;
            this.player1.play(this.hireOn);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.hireOn.location).toBe('archives');
        });
    });
});
