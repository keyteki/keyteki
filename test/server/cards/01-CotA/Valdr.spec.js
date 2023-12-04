describe('Valdr', function () {
    describe("Valdr's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['valdr']
                },
                player2: {
                    inPlay: ['troll', 'francus', 'zorg']
                }
            });
        });

        it('should deal extra damage to the creature on the left flank', function () {
            this.player1.fightWith(this.valdr, this.troll);
            expect(this.troll.location).toBe('discard');
        });

        it('should deal extra damage to the creature on the right flank', function () {
            this.player1.fightWith(this.valdr, this.zorg);
            expect(this.zorg.location).toBe('discard');
        });

        it('should not deal extra damage to a character not on a flank', function () {
            this.player1.fightWith(this.valdr, this.francus);
            expect(this.francus.tokens.damage).toBe(5);
        });
    });
});
