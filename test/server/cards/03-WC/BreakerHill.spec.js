describe('Breaker Hill', function () {
    describe("Breaker Hill's gained ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['krump', 'breaker-hill', 'troll', 'cowfyne']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'spyyyder', 'streke']
                }
            });
        });

        it('neighbor should be able to use action', function () {
            this.player1.useAction(this.krump);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);

            this.player1.useAction(this.troll);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });

        it('non-neighbor should not be able to use action', function () {
            this.player1.clickCard(this.cowfyne);
            expect(this.player1).not.toHavePromptButton("Use this player's Action");
        });
    });
});
