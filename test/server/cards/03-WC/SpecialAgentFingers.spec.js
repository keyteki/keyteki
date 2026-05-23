describe('Special Agent “Fingers”', function () {
    describe("Special Agent “Fingers”'s Action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['special-agent-fingers']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('steals 1A from the opponent', function () {
            this.player1.useAction(this.specialAgentFingers);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals nothing if opponent has 0A', function () {
            this.player2.player.amber = 0;
            this.player1.useAction(this.specialAgentFingers);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
