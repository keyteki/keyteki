describe('Skullback Crab', function () {
    describe("Skullback Crab's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    inPlay: ['skullback-crab'],
                    hand: ['kaupe']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });
        });

        it('Should have action and poison', function () {
            this.player1.clickCard(this.skullbackCrab);
            expect(this.player1).toHavePrompt('Skullback Crab');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar')
            this.player2.fightWith(this.troll, this.skullbackCrab);
            expect(this.troll.location).toBe('discard');
        });
    });
});
