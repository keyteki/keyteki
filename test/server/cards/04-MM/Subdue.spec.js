describe('Subdue', function () {
    describe("Subdue's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['helper-bot'],
                    hand: ['subdue']
                },
                player2: {
                    inPlay: ['dodger']
                }
            });
        });

        it('should deal one damage to a creature', function () {
            this.player1.play(this.subdue);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('discard');
        });

        it('should stun the damaged creature', function () {
            this.player1.play(this.subdue);
            this.player1.clickCard(this.dodger);
            expect(this.dodger.location).toBe('play area');
            expect(this.dodger.tokens.damage).toBe(1);
            expect(this.dodger.stunned).toBe(true);
        });
    });
});
