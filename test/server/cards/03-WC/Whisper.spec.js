describe('Whisper', function () {
    describe("Whisper's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['whisper', 'lamindra']
                },
                player2: {
                    inPlay: ['bulwark']
                }
            });
        });
        it('should not destroy a creature if no amber to lose', function () {
            this.player1.useAction(this.whisper);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).not.toHavePrompt('Choose a creature');
        });
        it('should be able to destroy a creature after losing amber', function () {
            this.player1.amber = 1;
            this.player1.useAction(this.whisper);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.whisper);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.bulwark);

            this.player1.clickCard(this.bulwark);

            expect(this.bulwark.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.whisper.location).toBe('play area');
        });
    });
});
