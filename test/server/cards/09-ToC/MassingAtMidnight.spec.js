describe('Massing at Midnight', function () {
    describe("Massing at Midnight's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'niffle-brute',
                    hand: ['massing-at-midnight']
                },
                player2: {
                    amber: 2
                }
            });

            this.niffleBrute1 = this.player1.player.deck[0];
            this.niffleBrute2 = this.player1.player.deck[1];
            this.niffleBrute3 = this.player1.player.deck[2];
        });

        it('should make 3 token creatures and purge itself', function () {
            this.player1.play(this.massingAtMidnight);
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Right');
            expect(this.niffleBrute1.location).toBe('play area');
            expect(this.niffleBrute2.location).toBe('play area');
            expect(this.niffleBrute3.location).toBe('play area');
            expect(this.massingAtMidnight.location).toBe('purged');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
