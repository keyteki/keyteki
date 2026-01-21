describe('Sequis', function () {
    describe("Sequis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['sequis']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should capture 1 amber when reaping', function () {
            this.player1.reap(this.sequis);
            expect(this.sequis.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not capture if opponent has no amber', function () {
            this.player2.amber = 0;
            this.player1.reap(this.sequis);
            expect(this.sequis.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
