describe('Lilithal', function () {
    describe("Lilithal's Fight/Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['lilithal']
                },
                player2: {
                    amber: 3,
                    inPlay: ['lamindra']
                }
            });
        });

        it('captures 1A on reap', function () {
            this.player1.reap(this.lilithal);
            expect(this.lilithal.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures 1A on fight', function () {
            this.player1.fightWith(this.lilithal, this.lamindra);
            expect(this.lilithal.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('captures nothing if opponent has 0A', function () {
            this.player2.player.amber = 0;
            this.player1.reap(this.lilithal);
            expect(this.lilithal.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
