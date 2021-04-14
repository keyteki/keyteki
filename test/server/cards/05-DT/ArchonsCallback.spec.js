describe("Archon's Callback", function () {
    describe("Archon's Callback's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['archon-s-callback', 'eyegor', 'helper-bot']
                }
            });
        });

        describe('when its played', function () {
            beforeEach(function () {
                this.player1.play(this.archonSCallback);
            });

            it('should draw 5 and end turn', function () {
                expect(this.player1.player.hand.length).toBe(7);
                expect(this.player2).toHavePrompt(
                    'Choose which house you want to activate this turn'
                );
            });
        });
    });
});
