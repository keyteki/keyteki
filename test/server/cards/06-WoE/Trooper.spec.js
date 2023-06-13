describe('Trooper', function () {
    describe("Trooper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['paraguardian'],
                    inPlay: ['trooper:flaxia'],
                    token: 'trooper'
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'slimy-jark']
                }
            });
        });

        it('should be exalted after reap', function () {
            this.player1.reap(this.trooper);
            expect(this.trooper.tokens.amber).toBe(1);
            this.player1.endTurn();
        });

        it('should be exalted after fight', function () {
            this.player1.fightWith(this.trooper, this.slimyJark);
            expect(this.trooper.tokens.amber).toBe(1);
            this.player1.endTurn();
        });
    });
});
