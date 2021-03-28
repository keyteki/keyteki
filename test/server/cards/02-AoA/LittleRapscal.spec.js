describe('LittleRapscal', function () {
    describe('Constant ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'brobnar',
                    inPlay: ['little-rapscal', 'troll', 'valdr']
                },
                player2: {
                    inPlay: ['umbra']
                }
            });
        });

        it('prevents other creatures from reaping or using action', function () {
            this.player1.clickCard(this.troll);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });
        it('allows other creatures to reap or use action if there is nothing to fight', function () {
            this.player1.fightWith(this.troll, this.umbra);
            expect(this.umbra.location).toBe('discard');
            this.player1.clickCard(this.valdr);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(5);
        });
    });
});
