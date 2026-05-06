describe('Jeen Peary', function () {
    describe('Jeen Peary on a flank', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['jeen-peary', 'bosun-creen']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('steals 1 after reaping', function () {
            this.player1.reap(this.jeenPeary);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Jeen Peary not on a flank', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['bosun-creen', 'jeen-peary', 'flip-stallard']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('does not steal after reaping', function () {
            this.player1.reap(this.jeenPeary);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
