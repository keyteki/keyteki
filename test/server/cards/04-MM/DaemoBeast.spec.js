describe('Dæmo-Beast', function () {
    describe("Dæmo-Beast's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['nexus', 'troll', 'dodger']
                },
                player2: {
                    amber: 0,
                    inPlay: ['dæmo-beast', 'old-yurk'],
                    hand: ['soulkeeper']
                }
            });
        });

        it('player 2 should steal 1 amber when dæmo-beast is destroyed', function () {
            this.player1.fightWith(this.troll, this.dæmoBeast);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
        });
    });
});
