describe('Dæmo-Knight', function () {
    describe("Dæmo-Knight's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['nexus', 'troll', 'dodger']
                },
                player2: {
                    amber: 0,
                    inPlay: ['dæmo-knight', 'old-yurk'],
                    hand: ['soulkeeper']
                }
            });
        });

        it('player 2 should steal 1 amber when dæmo-knight is destroyed', function () {
            this.player1.fightWith(this.troll, this.dæmoKnight);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
        });
    });
});
