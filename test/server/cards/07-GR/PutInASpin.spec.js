describe('Put in a Spin', function () {
    describe("Put in a Spin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['put-in-a-spin']
                },
                player2: {
                    discard: ['faust-the-great']
                }
            });
            this.player2.moveCard(this.faustTheGreat, 'deck');
        });

        it('can gain amber from correct guess', function () {
            this.player1.play(this.putInASpin);
            expect(this.player1.currentButtons).toContain('brobnar');
            expect(this.player1.currentButtons).toContain('dis');
            expect(this.player1.currentButtons).toContain('logos');
            expect(this.player1.currentButtons).toContain('mars');
            expect(this.player1.currentButtons).toContain('sanctum');
            expect(this.player1.currentButtons).toContain('shadows');
            expect(this.player1.currentButtons).toContain('untamed');
            expect(this.player1.currentButtons).toContain('saurian');
            expect(this.player1.currentButtons).toContain('staralliance');
            expect(this.player1.currentButtons).toContain('unfathomable');
            expect(this.player1.currentButtons).toContain('ekwidon');

            this.player1.clickPrompt('saurian');
            expect(this.player1.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('cannot gain amber from incorrect guess', function () {
            this.player1.play(this.putInASpin);
            this.player1.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does nothing if no amber to lose', function () {
            this.player1.amber = 0;
            this.player1.play(this.putInASpin);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
