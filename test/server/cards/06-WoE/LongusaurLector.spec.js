describe('Longusaur Lector', function () {
    describe("Longusaur Lector's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'grumpus',
                    hand: ['longusaur-lector']
                },
                player2: {
                    hand: ['batdrone']
                }
            });
        });

        it('should allow for not making a token on play', function () {
            this.player1.play(this.longusaurLector);
            this.player1.clickPrompt('Done');
            expect(this.longusaurLector.amber).toBe(0);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow for making a token on play', function () {
            this.player1.play(this.longusaurLector);
            this.player1.clickCard(this.longusaurLector);
            this.player1.clickPrompt('Right');
            expect(this.longusaurLector.amber).toBe(1);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow for not making a token on reap', function () {
            this.player1.play(this.longusaurLector);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');

            this.player1.reap(this.longusaurLector);
            this.player1.clickPrompt('Done');
            expect(this.longusaurLector.amber).toBe(0);
            expect(this.player1.player.creaturesInPlay.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow for making a token on reap', function () {
            this.player1.play(this.longusaurLector);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');

            this.player1.reap(this.longusaurLector);
            this.player1.clickCard(this.longusaurLector);
            this.player1.clickPrompt('Right');
            expect(this.longusaurLector.amber).toBe(1);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
