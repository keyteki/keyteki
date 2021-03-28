describe('Exile', function () {
    describe("Exile' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: [],
                    hand: ['questor-jarta', 'exile']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub']
                }
            });
        });

        it('should not ask for a creature if none is in play', function () {
            this.player1.play(this.exile);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(1);
        });

        it('should increase power +3 after exalt', function () {
            this.player1.playCreature(this.questorJarta);
            this.player1.play(this.exile);

            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.questorJarta);
            expect(this.player1).not.toBeAbleToSelect(this.gub);

            this.player1.clickCard(this.questorJarta);
            this.player1.clickPrompt('Left');

            expect(this.player2.player.creaturesInPlay).toContain(this.gub);
            expect(this.player2.player.creaturesInPlay).toContain(this.questorJarta);
        });
    });
});
