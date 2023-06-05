describe('Grunt Work', function () {
    describe("Grunt Work's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    token: 'grumpus',
                    inPlay: ['krump'],
                    hand: ['grunt-work', 'troll', 'bumpsy', 'titan-mechanic', 'brain-eater']
                },
                player2: {
                    amber: 8,
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should prompt the top 3 cards from the deck and make a token creature', function () {
            this.player1.moveCard(this.titanMechanic, 'deck');
            this.player1.moveCard(this.bumpsy, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player1.play(this.gruntWork);
            expect(this.player1).toHavePromptCardButton(this.troll);
            expect(this.player1).toHavePromptCardButton(this.bumpsy);
            expect(this.player1).toHavePromptCardButton(this.titanMechanic);
            this.player1.clickPrompt('bumpsy');
            this.player1.clickPrompt('troll');
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay).toContain(this.titanMechanic);
            expect(this.player1.player.creaturesInPlay[1].name).toBe('Grumpus');
        });
    });
});
