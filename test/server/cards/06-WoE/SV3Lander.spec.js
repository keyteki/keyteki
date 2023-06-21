describe('SV3 Lander', function () {
    describe("SV3 Lander's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    token: 'grumpus',
                    inPlay: ['grumpus:batdrone', 'bumpsy'],
                    hand: ['sv3-lander']
                },
                player2: {
                    token: 'grunt',
                    inPlay: ['grunt:flaxia']
                }
            });
        });

        it('should make a token on play', function () {
            this.player1.play(this.sv3Lander);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
        });

        it('should allow use of token creatures', function () {
            this.player1.play(this.sv3Lander);
            this.player1.clickPrompt('Right');
            let token2 = this.player1.player.creaturesInPlay[2];
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.clickCard(this.grumpus);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.useAction(this.sv3Lander, true);
            expect(this.sv3Lander.location).toBe('discard');
            this.player1.reap(this.grumpus);
            this.player1.reap(token2);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.clickCard(this.grunt);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1.amber).toBe(3);
        });
    });
});
