describe('Knoxx', function () {
    describe("Knoxx's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['knoxx'],
                    hand: ['flaxia', 'rustgnawer']
                },
                player2: {}
            });
        });

        it('should have +3 power for each neighbor', function () {
            expect(this.knoxx.power).toBe(3);

            this.player1.playCreature(this.flaxia, true);
            expect(this.knoxx.power).toBe(6);

            this.player1.playCreature(this.rustgnawer);
            expect(this.knoxx.power).toBe(9);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
