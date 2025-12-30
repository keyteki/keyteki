describe('Clear Mind', function () {
    describe("Clear Mind's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['clear-mind'],
                    inPlay: ['dodger', 'silvertooth', 'bulwark']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should unstun all friendly creatures', function () {
            this.dodger.stun();
            this.silvertooth.stun();
            this.bulwark.stun();
            this.player1.play(this.clearMind);
            expect(this.dodger.stunned).toBe(false);
            expect(this.silvertooth.stunned).toBe(false);
            expect(this.bulwark.stunned).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not unstun enemy creatures', function () {
            this.batdrone.stun();
            this.player1.play(this.clearMind);
            expect(this.batdrone.stunned).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
