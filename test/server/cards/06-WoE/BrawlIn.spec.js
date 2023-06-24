describe('Brawl-In', function () {
    describe("Brawl-In's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'grumpus',
                    amber: 2,
                    inPlay: ['armsmaster-molina'],
                    hand: ['red-alert', 'krump', 'brammo', 'brawl-in']
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'flaxia']
                }
            });
        });

        it('should make two tokens and enrage them', function () {
            this.player1.moveCard(this.redAlert, 'deck');
            this.player1.moveCard(this.brammo, 'deck');
            this.player1.play(this.brawlIn);
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('Left');
            expect(this.redAlert.name).toBe('Grumpus');
            expect(this.redAlert.enraged).toBe(true);
            expect(this.brammo.name).toBe('Grumpus');
            expect(this.brammo.enraged).toBe(true);
            this.player1.endTurn();
        });

        it('should make two tokens and enrage them', function () {
            this.player1.player.deck = [];
            this.player1.moveCard(this.brammo, 'deck');
            this.player1.play(this.brawlIn);
            this.player1.clickPrompt('Left');
            expect(this.brammo.name).toBe('Grumpus');
            expect(this.brammo.enraged).toBe(true);
            this.player1.endTurn();
        });

        it('should make no tokens', function () {
            this.player1.player.deck = [];
            this.player1.play(this.brawlIn);
            this.player1.endTurn();
        });
    });
});
