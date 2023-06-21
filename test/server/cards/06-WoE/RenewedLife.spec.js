describe('Renewed Life', function () {
    describe("Renewed Life's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    token: 'disciple',
                    amber: 2,
                    inPlay: ['troll'],
                    hand: ['renewed-life']
                },
                player2: {
                    amber: 7,
                    inPlay: ['gub', 'flaxia']
                }
            });
        });

        it('should make a token for each damage healed from the target creature', function () {
            this.troll.tokens.damage = 4;
            this.player1.play(this.renewedLife);
            expect(this.player1).toHavePrompt('Renewed Life');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(5);
            this.player1.endTurn();
        });
    });
});
