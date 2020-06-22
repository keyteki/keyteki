describe('Narp', function () {
    describe("Narp's Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'brobnar',
                    inPlay: ['troll', 'narp', 'drummernaut']
                },
                player2: {
                    amber: 7
                }
            });
        });

        it('should stop his neighbors from reaping', function () {
            this.player1.reap(this.narp);
            expect(this.player1.amber).toBe(1);
            this.player1.clickCard(this.troll);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickCard(this.drummernaut);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
        });
    });
});
