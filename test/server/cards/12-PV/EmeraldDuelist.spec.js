describe('Emerald Duelist', function () {
    describe("Emerald Duelist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    inPlay: ['yurk', 'emerald-duelist', 'bulwark']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'searine']
                }
            });
        });

        it('should make neighbors capture 1 amber after fighting', function () {
            this.player1.fightWith(this.emeraldDuelist, this.flaxia);
            expect(this.bulwark.amber).toBe(1);
            expect(this.yurk.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
