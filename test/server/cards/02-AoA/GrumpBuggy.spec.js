describe('Grump Buggy', function () {
    describe("Grump Buggy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 6,
                    inPlay: ['grump-buggy', 'troll']
                },
                player2: {
                    amber: 6,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should increase opponent key cost for each friendly creature with power 5+', function () {
            this.player1.endTurn();

            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.amber).toBe(6);
            expect(this.player2).hasPrompt('Choose which house you want to activate this turn');
        });

        it('should increase own key cost for each enemy creature with power 5+', function () {
            this.player2.amber = 8;
            this.player1.endTurn();

            this.player2.clickPrompt('sanctum');
            this.player2.endTurn();

            expect(this.player2.player.keys.red).toBe(true);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).hasPrompt('Choose which house you want to activate this turn');
        });
    });
});
