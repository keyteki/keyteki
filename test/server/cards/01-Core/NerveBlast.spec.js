describe('Nerve Blast', function () {
    describe("Nerve Blast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['nerve-blast', 'silvertooth']
                },
                player2: {
                    amber: 2,
                    inPlay: []
                }
            });
        });

        it('should steal an amber, and trigger the damage', function () {
            this.player1.play(this.silvertooth);
            this.player1.play(this.nerveBlast);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Nerve Blast');
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not trigger damage when there are no creatures in play', function () {
            this.player1.play(this.nerveBlast);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not do anything if you cannot steal', function () {
            this.player2.amber = 0;
            this.player1.play(this.nerveBlast);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
