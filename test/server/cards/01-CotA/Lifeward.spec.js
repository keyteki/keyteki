describe('Lifeward', function () {
    describe("Lifeward's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['lifeward']
                },
                player2: {
                    inPlay: [],
                    hand: ['troll', 'gauntlet-of-command']
                }
            });
        });

        it('should stop their opponent playing creatures', function () {
            this.player1.clickCard(this.lifeward);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.lifeward.location).toBe('discard');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.troll);
            expect(this.player2).toHavePrompt('Troll');
            expect(this.player2).toHavePromptButton('Discard this card');
            expect(this.player2).toHavePromptButton('Cancel');
            expect(this.player2).not.toHavePromptButton('Play this creature');
            this.player2.clickPrompt('Cancel');
            this.player2.clickCard(this.gauntletOfCommand);
            expect(this.player2).toHavePrompt('Gauntlet of Command');
            expect(this.player2).toHavePromptButton('Play this artifact');
            expect(this.player2).toHavePromptButton('Discard this card');
            expect(this.player2).toHavePromptButton('Cancel');
        });
    });
});
