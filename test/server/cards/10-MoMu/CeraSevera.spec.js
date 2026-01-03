describe('Cera Severa', function () {
    describe("Cera Severa's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'saurian',
                    inPlay: ['cera-severa', 'faust-the-great']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'krump', 'lamindra']
                }
            });
        });

        it('should capture 1 on reap', function () {
            this.player1.reap(this.ceraSevera);
            expect(this.ceraSevera.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should capture 1 on fight', function () {
            this.player1.fightWith(this.ceraSevera, this.lamindra);
            expect(this.ceraSevera.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should deal damage to an enemy creature on destroy', function () {
            this.ceraSevera.amber = 3;
            this.player1.fightWith(this.ceraSevera, this.troll);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.ceraSevera);
            expect(this.player1).not.toBeAbleToSelect(this.faustTheGreat);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
