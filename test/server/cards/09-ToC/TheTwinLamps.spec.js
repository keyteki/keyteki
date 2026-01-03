describe('The Twin Lamps', function () {
    describe("The Twin Lamps's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'wrangler',
                    hand: ['the-twin-lamps']
                },
                player2: {
                    amber: 3
                }
            });

            this.wrangler1 = this.player1.player.deck[0];
        });

        it('should steal on play', function () {
            this.player1.play(this.theTwinLamps);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.wrangler1.location).toBe('deck');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should make a token if you have more amber', function () {
            this.player1.amber = 2;
            this.player1.play(this.theTwinLamps);
            expect(this.wrangler1.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
