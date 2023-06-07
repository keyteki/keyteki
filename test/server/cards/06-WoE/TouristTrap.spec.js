describe('Tourist Trap', function () {
    describe("Tourist Trap's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'grunt',
                    inPlay: ['grunt:clone-home', 'pelf'],
                    hand: ['tourist-trap', 'mass-buyout']
                },
                player2: {
                    token: 'warrior',
                    inPlay: ['selwyn-the-fence', 'warrior:flaxia', 'bumpsy']
                }
            });
        });

        it('makes a token creature on play', function () {
            this.player1.play(this.touristTrap);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('allows player to swap a token creature with opponent creature', function () {
            this.player1.play(this.touristTrap);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.grunt2 = this.player1.player.creaturesInPlay[2];

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            this.player1.clickPrompt('ekwidon');
            this.player1.useAction(this.touristTrap);
            expect(this.player1).toBeAbleToSelect(this.grunt);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.grunt2);
            expect(this.player1).not.toBeAbleToSelect(this.selwynTheFence);
            expect(this.player1).not.toBeAbleToSelect(this.warrior);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.grunt);
            expect(this.player1).not.toBeAbleToSelect(this.grunt);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.grunt2);
            expect(this.player1).toBeAbleToSelect(this.selwynTheFence);
            expect(this.player1).toBeAbleToSelect(this.warrior);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1.player.cardsInPlay).toContain(this.bumpsy);
            expect(this.player1.player.cardsInPlay).not.toContain(this.grunt);
            expect(this.player2.player.cardsInPlay).not.toContain(this.bumpsy);
            expect(this.player2.player.cardsInPlay).toContain(this.grunt);
        });

        it('does nothing if no creatures in play', function () {
            this.player1.play(this.touristTrap);
            this.player1.clickPrompt('Right');
            this.player1.endTurn();
            this.grunt2 = this.player1.player.creaturesInPlay[2];

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            this.player1.clickPrompt('ekwidon');
            this.player1.play(this.massBuyout);
            this.player1.useAction(this.touristTrap);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
