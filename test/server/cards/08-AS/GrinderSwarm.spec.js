describe('Grinder Swarm', function () {
    describe("Grinder Swarm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['pelf'],
                    inPlay: ['krump', 'grinder-swarm', 'rowdy-skald']
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should get +1 power for each creature in play', function () {
            expect(this.grinderSwarm.getPower()).toBe(7);
            this.player1.playCreature(this.pelf);
            expect(this.grinderSwarm.getPower()).toBe(8);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should capture 2 on fight', function () {
            this.player1.fightWith(this.grinderSwarm, this.lamindra);
            expect(this.grinderSwarm.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
