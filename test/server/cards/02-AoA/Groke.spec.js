describe('Groke', function () {
    describe("Groke's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['groke']
                },
                player2: {
                    amber: 2,
                    inPlay: ['nexus', 'bad-penny', 'macis-asp']
                }
            });
        });

        it('should cause opponent to lose 1A after fight.', function () {
            this.player1.fightWith(this.groke, this.nexus);
            expect(this.groke.location).toBe('play area');
            expect(this.player2.amber).toBe(1);
            this.player1.endTurn();
        });

        it('should not cause opponent to lose 1A if destroyed.', function () {
            this.player1.fightWith(this.groke, this.macisAsp);
            expect(this.groke.location).toBe('discard');
            expect(this.player2.amber).toBe(2);
            this.player1.endTurn();
        });
    });
});
