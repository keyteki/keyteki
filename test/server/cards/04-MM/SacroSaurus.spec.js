describe('Sacro-Saurus', function () {
    describe("Sacro-Saurus's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['old-yurk'],
                    hand: ['sacro-saurus']
                },
                player2: {
                    inPlay: ['troll', 'dodger']
                }
            });
        });

        it('should be able to exalt itself and decline', function () {
            this.player1.play(this.sacroSaurus);
            this.player1.clickPrompt('Done');
            expect(this.sacroSaurus.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to exalt itself and deal 3D to a creature', function () {
            this.player1.play(this.sacroSaurus);
            this.player1.clickCard(this.sacroSaurus);
            expect(this.player1).toBeAbleToSelect(this.sacroSaurus);
            expect(this.player1).toBeAbleToSelect(this.oldYurk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.troll);
            expect(this.sacroSaurus.amber).toBe(1);
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
