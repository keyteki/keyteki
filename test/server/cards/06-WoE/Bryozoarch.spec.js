describe('Bryozoarch', function () {
    describe("Bryozoarch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['labwork']
                },
                player2: {
                    token: 'grumpus',
                    inPlay: ['skullback-crab', 'bryozoarch'],
                    hand: ['initiation']
                }
            });
        });

        it('should blank opponent actions', function () {
            this.player1.play(this.labwork);
            expect(this.player2.player.creaturesInPlay.length).toBe(1);
            expect(this.skullbackCrab.location).toBe('discard');
            expect(this.bryozoarch.location).toBe('play area');
            expect(this.player2.player.archives.length).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not blank my actions', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.play(this.initiation);
            this.player2.clickPrompt('Right');
            expect(this.player2.player.creaturesInPlay.length).toBe(3);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
