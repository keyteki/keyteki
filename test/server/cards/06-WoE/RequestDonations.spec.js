describe('Request Donations', function () {
    describe("Request Donations' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    token: 'disciple',
                    amber: 2,
                    inPlay: ['troll'],
                    hand: ['request-donations', 'brammo']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'flaxia']
                }
            });
        });

        it('should make a token and have it capture 2A', function () {
            this.player1.moveCard(this.brammo, 'deck');
            this.player1.play(this.requestDonations);
            this.player1.clickPrompt('Left');
            expect(this.brammo.name).toBe('Disciple');
            expect(this.brammo.amber).toBe(2);
            this.player1.endTurn();
        });

        it('should do nothing if you cannot make a token', function () {
            this.player1.player.deck = [];
            this.player1.play(this.requestDonations);
            this.player1.endTurn();
        });
    });
});
