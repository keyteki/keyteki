describe('EMP Blast', function () {
    describe("EMP Blast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['emp-blast'],
                    inPlay: ['dodger', 'mother']
                },
                player2: {
                    inPlay: ['blypyp', 'crystal-hive']
                }
            });
        });

        it('should stun and destroy all artifacts', function () {
            this.player1.play(this.empBlast);
            expect(this.dodger.stunned).toBe(false);
            expect(this.mother.stunned).toBe(true);
            expect(this.blypyp.stunned).toBe(true);
            expect(this.crystalHive.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
