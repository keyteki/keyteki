describe('Ancient Battleground', function () {
    describe("Ancient Battleground's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'warrior',
                    amber: 2,
                    inPlay: ['ancient-battleground', 'krump', 'brammo', 'lamindra']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub']
                }
            });
        });

        it('should not be able to reap with friendly creatures', function () {
            this.player1.clickCard(this.krump);
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
        });

        it('should gain 1A after fight', function () {
            this.player1.fightWith(this.krump, this.gub);
            expect(this.player1.amber).toBe(3);
            expect(this.gub.location).toBe('discard');
            this.player1.endTurn();
        });

        it("opponent's creatures should be able to reap and fight", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.reap(this.gub);
            this.player2.endTurn();
        });
    });
});
