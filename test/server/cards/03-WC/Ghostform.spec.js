describe('Ghostform', function () {
    describe("Ghostform's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['urchin'],
                    hand: ['ghostform']
                },
                player2: {
                    inPlay: ['snufflegator', 'inka-the-spider'],
                    hand: ['mighty-tiger', 'perilous-wild']
                }
            });

            this.player1.playUpgrade(this.ghostform, this.urchin);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
        });

        it('should not allow the creature to be damaged', function () {
            this.player2.play(this.mightyTiger);
            expect(this.player2).toHavePrompt('Mighty Tiger');
            expect(this.player2).toBeAbleToSelect(this.urchin);
            this.player2.clickCard(this.urchin);
            expect(this.urchin.hasToken('damage')).toBe(false);
            expect(this.urchin.location).toBe('play area');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
