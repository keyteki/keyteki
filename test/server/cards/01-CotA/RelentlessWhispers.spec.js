describe('Relentless Whispers', function () {
    describe("Relentless Whispers' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['relentless-whispers', 'silvertooth', 'bad-penny', 'dodger']
                },
                player2: {
                    amber: 2,
                    inPlay: []
                }
            });
        });

        it('should steal an amber when killing a creature', function () {
            this.player1.play(this.silvertooth);
            this.player1.play(this.relentlessWhispers);
            expect(this.player1).toHavePrompt('Relentless Whispers');
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not steal an amber when creature is not killed', function () {
            this.player1.play(this.dodger);
            this.player1.play(this.relentlessWhispers);
            expect(this.player1).toHavePrompt('Relentless Whispers');
            expect(this.player1).toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.dodger);
            expect(this.dodger.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not trigger damage when there are no creatures in play', function () {
            this.player1.play(this.relentlessWhispers);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
