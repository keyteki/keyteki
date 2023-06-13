describe('Sunk Cost', function () {
    describe("Sunk Cost's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'grumpus',
                    hand: ['sunk-cost']
                },
                player2: {
                    hand: ['doc-bookton', 'batdrone', 'pit-demon', 'troll', 'pelf']
                }
            });
        });

        it('should not make a token if the discard does not match house call', function () {
            this.player2.moveCard(this.docBookton, 'discard');
            this.player2.moveCard(this.batdrone, 'discard');
            this.player1.play(this.sunkCost);
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('logos');
            expect(this.player1).toHavePromptButton('brobnar');
            expect(this.player1).not.toHavePromptButton('mars');
            this.player1.clickPrompt('logos');
            expect(this.player2.player.hand.length).toBe(2);
            expect(this.player1.player.creaturesInPlay.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make a token if the discard does match house call', function () {
            this.player2.moveCard(this.pitDemon, 'discard');
            this.player2.moveCard(this.troll, 'discard');
            this.player2.moveCard(this.pelf, 'discard');
            this.player1.play(this.sunkCost);
            this.player1.clickPrompt('logos');
            expect(this.player2.player.hand.length).toBe(1);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
