describe('Reap the Wild Wind', function () {
    describe("Reap the Wild Wind's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'ekwidon',
                    hand: ['reap-the-wild-wind', 'dust-pixie']
                },
                player2: {
                    amber: 2,
                    hand: ['control-the-weak', 'mark-of-dis']
                }
            });
        });

        it('should reveal a random card for each player and gain amber', function () {
            this.player1.play(this.reapTheWildWind);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
