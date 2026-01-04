describe('Ace Jonavan', function () {
    describe("Ace Jonavan's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 9,
                    house: 'ekwidon',
                    inPlay: ['charette'],
                    hand: ['ace-jonavan']
                },
                player2: {
                    amber: 12
                }
            });

            this.charette.amber = 3;
            this.player1.play(this.aceJonavan);
        });

        it('should capture one on play', function () {
            expect(this.aceJonavan.amber).toBe(1);
            expect(this.player2.amber).toBe(11);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should increase cost for each amber on it, for both players', function () {
            this.player1.endTurn();

            // Forge for 7.
            this.player2.clickPrompt('Yellow');
            expect(this.player2.player.keys.yellow).toBe(true);
            expect(this.player2.player.amber).toBe(4);

            this.aceJonavan.amber = 2;
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            // Forge for 8.
            this.player1.clickPrompt('Yellow');
            expect(this.player1.player.keys.yellow).toBe(true);
            expect(this.player1.player.amber).toBe(1);
        });
    });
});
