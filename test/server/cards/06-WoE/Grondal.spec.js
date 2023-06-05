describe('Grondal', function () {
    describe("Grondal's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    token: 'grumpus',
                    hand: ['grondal'],
                    deck: ['toad', 'toad']
                },
                player2: {
                    inPlay: ['urchin', 'dust-pixie']
                }
            });
        });

        it('makes two tokens on play', function () {
            this.player1.playCreature(this.grondal);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            this.player1.endTurn();
        });

        it('destroys lowest creature at start of turn', function () {
            this.player1.playCreature(this.grondal);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
        });
    });
});
