describe('Keep the Change', function () {
    describe("Keep the Change's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 5,
                    hand: ['keep-the-change'],
                    deck: ['urchin', 'urchin', 'urchin', 'urchin', 'urchin', 'urchin', 'urchin']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('pays opponent N amber and draws N cards', function () {
            this.player1.play(this.keepTheChange);
            this.player1.clickPrompt('3');
            // amber gain from card play (+1) then -3
            expect(this.player1.amber).toBe(5 + 1 - 3);
            expect(this.player2.amber).toBe(1 + 3);
            // hand had keep-the-change, played; then drew 3
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('limits choices to player amber', function () {
            this.player1.amber = 2;
            this.player1.play(this.keepTheChange);
            // now player has 2 + 1 (bonus) = 3 amber
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).not.toHavePromptButton('4');
            this.player1.clickPrompt('3');
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be played with 0 amber and does nothing', function () {
            this.player1.amber = 0;
            this.player1.play(this.keepTheChange);
            // Player gets 1 amber from playing the card, but choice list still works
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).not.toHavePromptButton('2');
            this.player1.clickPrompt('0');
            // No transfer, no draws
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
