describe('Brammo', function () {
    describe("Brammo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['brammo']
                },
                player2: {
                    inPlay: ['mother', 'batdrone', 'dextre']
                }
            });
        });

        it('should deal 2 damage to each enemy flank creature on play', function () {
            this.player1.play(this.brammo);
            expect(this.mother.damage).toBe(2);
            expect(this.batdrone.damage).toBe(0);
            expect(this.dextre.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal 2 damage to a singular enemy flank creature on play', function () {
            this.player2.moveCard(this.dextre, 'discard');
            this.player2.moveCard(this.batdrone, 'discard');
            this.player1.play(this.brammo);
            expect(this.mother.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
