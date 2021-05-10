describe('Mega Groke', function () {
    describe("Mega Groke's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['mega-groke']
                },
                player2: {
                    amber: 2,
                    inPlay: ['nexus', 'bad-penny', 'tolas'],
                    discard: ['flaxia', 'nexus']
                }
            });
        });

        it('should cause opponent to lose 1A after fight.', function () {
            this.player1.fightWith(this.megaGroke, this.nexus);
            expect(this.player2.amber).toBe(1);
        });
    });
});
