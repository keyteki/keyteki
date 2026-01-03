describe('Lomir Flamefist', function () {
    describe("Lomir Flamefist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['lomir-flamefist']
                },
                player2: {
                    amber: 7,
                    inPlay: ['troll']
                }
            });
        });

        it('should make opponent lose 2 amber when they have 7+ amber', function () {
            this.player1.playCreature(this.lomirFlamefist);
            expect(this.player2.amber).toBe(5);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not affect opponent with less than 7 amber', function () {
            this.player2.amber = 6;
            this.player1.playCreature(this.lomirFlamefist);
            expect(this.player2.amber).toBe(6);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
