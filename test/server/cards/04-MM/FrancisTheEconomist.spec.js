describe('Francis The Economist', function () {
    describe("Francis the Economist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'shadows',
                    inPlay: ['lieutenant-khrkhar', 'francis-the-economist'],
                    hand: ['hand-of-dis', 'pitlord']
                },
                player2: {
                    amber: 3,
                    inPlay: ['mighty-tiger', 'snufflegator', 'dust-pixie']
                }
            });
        });

        it('should give each player 1 amber after a fight', function () {
            this.player1.fightWith(this.francisTheEconomist, this.dustPixie);

            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
        });
    });
});
