describe('Sow Salt', function () {
    describe("Sow Salt's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['sow-salt'],
                    inPlay: ['tribune-pompitus']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
        });

        it('should not allow player to reap until their next turn', function () {
            this.player1.play(this.sowSalt);
            this.player1.clickCard(this.tribunePompitus);
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).not.toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Cancel');
            this.player1.endTurn();

            this.player2.clickPrompt('logos');
            this.player2.clickCard(this.mother);
            expect(this.player2).toHavePromptButton('Fight with this creature');
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.endTurn();

            this.player1.clickPrompt('saurian');
            this.player1.clickCard(this.tribunePompitus);
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).toHavePromptButton('Reap with this creature');
        });
    });
});
