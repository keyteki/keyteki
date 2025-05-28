describe('Dame Margaret', function () {
    describe("Dame Margaret's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    inPlay: ['dust-pixie', 'dame-margaret']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia']
                }
            });
        });

        it('should get +2 armor for each key opponent has forged', function () {
            expect(this.dameMargaret.armor).toBe(0);
            this.player2.player.keys = { blue: false, red: false, yellow: true };
            this.player1.reap(this.dameMargaret); // force state update
            expect(this.dameMargaret.armor).toBe(2);
            this.player2.player.keys = { blue: false, red: true, yellow: true };
            this.dameMargaret.exhausted = false;
            this.player1.reap(this.dameMargaret); // force state update
            expect(this.dameMargaret.armor).toBe(4);
            expect(this.dustPixie.armor).toBe(0);
        });
    });
});
