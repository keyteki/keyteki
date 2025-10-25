describe('Chota Hazri', function () {
    describe("Chota Hazri's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['chota-hazri']
                },
                player2: {
                    amber: 0
                }
            });
        });

        it('should lose 1 amber and forge a key if possible', function () {
            this.player1.amber = 7;
            this.player1.play(this.chotaHazri);
            this.player1.clickPrompt('yes');
            this.player1.clickPrompt('red');
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should lose 1 amber and not forge a key if not enough amber', function () {
            this.player1.amber = 6;
            this.player1.play(this.chotaHazri);
            expect(this.player1.amber).toBe(5);
            expect(this.player1.player.getForgedKeys()).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
