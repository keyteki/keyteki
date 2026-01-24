describe('Urchin', function () {
    describe("Urchin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['urchin']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        it('should steal 1 amber on play', function () {
            this.player1.playCreature(this.urchin);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal if opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.playCreature(this.urchin);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
