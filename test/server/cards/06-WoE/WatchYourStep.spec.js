describe('Watch Your Step', function () {
    describe("Watch Your Step's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'grumpus',
                    hand: ['watch-your-step']
                },
                player2: {
                    token: 'warrior',
                    inPlay: ['doc-bookton', 'pit-demon', 'troll']
                }
            });
        });

        it('should not make tokens if the opponent follows instructions', function () {
            this.player1.play(this.watchYourStep);
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not make tokens if the opponent does follow instructions and deck is empty', function () {
            this.player1.play(this.watchYourStep);
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player1.player.deck = [];
            this.player2.clickPrompt('logos');
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should gain make 2 ready tokens if the opponent does not follow instructions', function () {
            this.player1.play(this.watchYourStep);
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickPrompt('Right');
            expect(this.player2.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1.player.creaturesInPlay[0].exhausted).toBe(false);
            expect(this.player1.player.creaturesInPlay[1].exhausted).toBe(false);
        });
    });
});
