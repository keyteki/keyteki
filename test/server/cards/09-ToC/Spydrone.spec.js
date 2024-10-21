describe('Spydrone', function () {
    describe("Spydrone's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    token: 'spydrone',
                    inPlay: ['spydrone:gub', 'helper-bot']
                },
                player2: {
                    amber: 1
                }
            });

            this.spydrone = this.player1.player.creaturesInPlay[0];
        });

        it('should draw a card on action', function () {
            this.player1.useAction(this.spydrone);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
