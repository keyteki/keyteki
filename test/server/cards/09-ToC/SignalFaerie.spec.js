describe('Signal Faerie', function () {
    describe("Signal Faerie's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'niffle-brute',
                    hand: ['signal-faerie']
                },
                player2: {
                    amber: 2
                }
            });

            this.niffleBrute1 = this.player1.player.deck[0];
            this.niffleBrute2 = this.player1.player.deck[1];
        });

        it('should make a token creature on play', function () {
            this.player1.playCreature(this.signalFaerie);
            this.player1.clickPrompt('Right');
            expect(this.niffleBrute1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make a token creature on reap', function () {
            this.player1.playCreature(this.signalFaerie);
            this.player1.clickPrompt('Right');
            this.signalFaerie.exhausted = false;
            this.player1.reap(this.signalFaerie);
            this.player1.clickPrompt('Right');
            expect(this.niffleBrute2.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
