describe('Diplomat', function () {
    describe("Diplomat's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 4,
                    token: 'diplomat',
                    hand: ['antiquities-dealer'],
                    inPlay: ['diplomat:pelf']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should cause each player to gain 1 on reap', function () {
            this.player1.reap(this.diplomat);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(3);
        });
    });
});
