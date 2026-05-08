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
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('limits choices to player amber', function () {
            this.player1.amber = 2;
            this.player1.play(this.keepTheChange);
            // now player has 2 + 1 (bonus) = 3 amber
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
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
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).not.toHavePromptButton('2');
            this.player1.clickPrompt('0');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('caps choices at 6 even when player has more amber', function () {
            this.player1.amber = 7;
            this.player1.play(this.keepTheChange);
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).toHavePromptButton('4');
            expect(this.player1).toHavePromptButton('5');
            expect(this.player1).toHavePromptButton('6');
            expect(this.player1).not.toHavePromptButton('7');
            expect(this.player1).not.toHavePromptButton('8');
            this.player1.clickPrompt('6');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(7);
            expect(this.player1.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
