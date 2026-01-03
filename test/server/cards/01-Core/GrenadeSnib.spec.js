describe('Grenade Snib', function () {
    describe("Grenade Snib's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['grenade-snib']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll']
                }
            });
        });

        it('should cause opponent to lose 2 amber when destroyed', function () {
            this.player1.fightWith(this.grenadeSnib, this.troll);
            expect(this.grenadeSnib.location).toBe('discard');
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
