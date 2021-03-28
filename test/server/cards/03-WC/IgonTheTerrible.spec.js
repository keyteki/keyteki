describe('Igon The Terrible', function () {
    describe("Igon The Terrible's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['igon-the-terrible', 'igon-the-green'],
                    inPlay: ['overlord-greking', 'dominator-bauble']
                },
                player2: {
                    inPlay: ['mother', 'troll', 'dextre']
                }
            });
        });
        it("should immediately be destroyed if Igon the Green hasn't been purged", function () {
            this.player1.play(this.igonTheTerrible);
            expect(this.igonTheTerrible.location).toBe('discard');
        });
        it('should play as normal if Igon the Green has been purged', function () {
            this.player1.moveCard(this.igonTheGreen, 'purged');
            expect(this.igonTheGreen.location).toBe('purged');
            this.player1.play(this.igonTheTerrible);
            expect(this.igonTheTerrible.location).toBe('play area');
        });
    });
});
