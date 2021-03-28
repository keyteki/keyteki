describe('Lyco-Saurus', function () {
    describe("Lyco-Saurus's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['old-yurk'],
                    hand: ['lyco-saurus']
                },
                player2: {
                    inPlay: ['troll', 'dodger']
                }
            });
        });

        it('should be able to exalt itself and decline', function () {
            this.player1.play(this.lycoSaurus);
            this.player1.clickPrompt('Done');
            expect(this.lycoSaurus.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to exalt itself and deal 3D to a creature', function () {
            this.player1.play(this.lycoSaurus);
            this.player1.clickCard(this.lycoSaurus);
            expect(this.player1).toBeAbleToSelect(this.lycoSaurus);
            expect(this.player1).toBeAbleToSelect(this.oldYurk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.troll);
            expect(this.lycoSaurus.amber).toBe(1);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
