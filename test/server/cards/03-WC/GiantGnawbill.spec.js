describe('Giant Gnawbill', function () {
    describe("Giant Gnawbill's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['giant-gnawbill'],
                    hand: ['heart-of-the-forest', 'nepenthe-seed'],
                    discard: ['tocsin', 'batdrone']
                },
                player2: {
                    hand: ['mighty-tiger', 'snufflegator', 'inka-the-spider'],
                    inPlay: ['quantum-fingertrap'],
                    discard: ['flaxia']
                }
            });
        });

        it('should NOT prompt a player to destroy an artifact of the chosen house when a selection is made when there isnt one in play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt a player to destroy an artifact of the chosen house when a selection is made when there is one in play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            expect(this.player2).toHavePrompt('Giant Gnawbill');
            expect(this.player2).not.toBeAbleToSelect(this.heartOfTheForest);
            expect(this.player2).not.toBeAbleToSelect(this.nepentheSeed);
            expect(this.player2).toBeAbleToSelect(this.quantumFingertrap);
            this.player2.clickCard(this.quantumFingertrap);
            expect(this.quantumFingertrap.location).toBe('discard');
        });

        it('should prompt a player to destroy an artifact of the chosen house when a selection is made when there is more than one in play', function () {
            this.player1.play(this.nepentheSeed);
            this.player1.play(this.heartOfTheForest);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2).toHavePrompt('Giant Gnawbill');
            expect(this.player2).toBeAbleToSelect(this.heartOfTheForest);
            expect(this.player2).toBeAbleToSelect(this.nepentheSeed);
            expect(this.player2).not.toBeAbleToSelect(this.quantumFingertrap);
            this.player2.clickCard(this.nepentheSeed);
            expect(this.nepentheSeed.location).toBe('discard');
        });
    });
});
