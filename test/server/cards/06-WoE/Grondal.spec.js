describe('Grondal', function () {
    describe("Grondal's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    token: 'grumpus',
                    hand: ['grondal'],
                    inPlay: ['toad'],
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
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            this.player1.endTurn();
        });

        it('destroys lowest creature at start of turn', function () {
            this.player1.playCreature(this.grondal);
            this.player1.clickPrompt('Left');
            let grumpus1 = this.player1.player.creaturesInPlay[0];
            this.player1.clickPrompt('Left');
            let grumpus2 = this.player1.player.creaturesInPlay[0];
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.toad);
            expect(this.player1).not.toBeAbleToSelect(this.grondal);
            expect(this.player1).not.toBeAbleToSelect(grumpus1);
            expect(this.player1).not.toBeAbleToSelect(grumpus2);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
        });
    });
});
