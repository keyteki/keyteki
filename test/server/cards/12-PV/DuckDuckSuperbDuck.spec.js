describe('Duck, Duck, Superb Duck', function () {
    describe("Duck, Duck, Superb Duck's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['duck-duck-superb-duck', 'ember-imp', 'draining-touch', 'helper-bot']
                },
                player2: {
                    amber: 3,
                    inPlay: ['flaxia']
                }
            });
        });

        it('should archive 2 random cards when that option is chosen', function () {
            this.player1.play(this.duckDuckSuperbDuck);
            this.player1.clickPrompt('Archive 2 random cards');
            expect(this.player1.player.archives.length).toBe(2);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain 2 amber when that option is chosen', function () {
            this.player1.play(this.duckDuckSuperbDuck);
            this.player1.clickPrompt('Gain 2');
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
