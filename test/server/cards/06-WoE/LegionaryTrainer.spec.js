describe('Legionary Trainer', function () {
    describe("Legionary Trainer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    token: 'b0-t',
                    hand: ['paraguardian', 'legionary-trainer'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    token: 'b0-t',
                    inPlay: ['krump'],
                    hand: ['scout-chief-korijir']
                }
            });
        });

        it('should make a token on play', function () {
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            this.player1.play(this.legionaryTrainer);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
        });

        it('should not make normal creatures should come into play ready', function () {
            this.player1.play(this.legionaryTrainer);
            this.player1.clickPrompt('Right');
            this.player1.play(this.paraguardian);
            expect(this.legionaryTrainer.exhausted).toBe(true);
            expect(this.paraguardian.exhausted).toBe(true);
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
        });

        it('should make player 1 tokens enter play ready', function () {
            this.player1.play(this.legionaryTrainer);
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1.player.creaturesInPlay[0].exhausted).toBe(false);
        });

        it('should not make player two tokens enter play ready', function () {
            this.player1.play(this.legionaryTrainer);
            this.player1.clickPrompt('Left');
            this.player1.endTurn();

            this.player2.clickPrompt('staralliance');
            this.player2.play(this.scoutChiefKorijir);
            this.player2.clickPrompt('Left');
            expect(this.scoutChiefKorijir.exhausted).toBe(true);
            expect(this.player2.player.creaturesInPlay[0].exhausted).toBe(true);
        });
    });
});
