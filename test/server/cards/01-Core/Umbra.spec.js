describe('Umbra', function () {
    describe("Umbra's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['umbra']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        it('should steal 1 amber on fight', function () {
            this.player1.fightWith(this.umbra, this.troll);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal if opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.fightWith(this.umbra, this.troll);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
