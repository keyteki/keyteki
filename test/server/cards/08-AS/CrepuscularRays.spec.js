describe('Crepuscular Rays', function () {
    describe("Crepuscular Ray's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['crepuscular-rays'],
                    inPlay: ['umbra', 'lamindra']
                },
                player2: {
                    inPlay: ['redlock', 'krump']
                }
            });

            this.umbra.amber = 3;
        });

        it('should destroy a friendly creature and gain amber', function () {
            this.player1.play(this.crepuscularRays);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.umbra);
            expect(this.umbra.location).toBe('discard');
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
