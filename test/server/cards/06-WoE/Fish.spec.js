describe('Fish', function () {
    describe("Fish's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['fish:flaxia'],
                    token: 'fish'
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('fish should make enemy creature take damage when destroyed', function () {
            this.player1.fightWith(this.fish, this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(4);
            expect(this.fish.location).toBe('discard');
            this.player1.endTurn();
        });
    });
});
