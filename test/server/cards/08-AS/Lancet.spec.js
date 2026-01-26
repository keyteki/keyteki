describe('Lancet', function () {
    describe("Lancet 's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    inPlay: ['lancet', 'gub']
                },
                player2: {
                    amber: 3,
                    inPlay: ['lamindra']
                }
            });

            this.player1.makeMaverick(this.lancet, 'dis');
        });

        it('should give each friendly creature a fight ability to capture 1', function () {
            this.player1.fightWith(this.gub, this.lamindra);
            expect(this.gub.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.player1.fightWith(this.lancet, this.lamindra);
            expect(this.gub.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
