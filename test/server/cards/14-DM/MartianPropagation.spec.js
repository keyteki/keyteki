describe('Martian Propagation', function () {
    describe("Martian Propagation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['martian-propagation', 'urchin', 'troll', 'bumpsy', 'autocannon'],
                    inPlay: ['john-smyth', 'iyxrenu-the-clever']
                },
                player2: {
                    inPlay: ['krump']
                }
            });
        });

        it('destroys friendly creatures and draws 2 per destroyed', function () {
            const handSize = this.player1.player.hand.length;
            this.player1.play(this.martianPropagation);
            expect(this.johnSmyth.location).toBe('discard');
            expect(this.iyxrenuTheClever.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
            // hand was 4 (after playing martian-propagation), drew 4
            expect(this.player1.player.hand.length).toBe(handSize - 1 + 4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not draw for warded friendly creatures', function () {
            this.johnSmyth.tokens.ward = 1;
            const handSize = this.player1.player.hand.length;
            this.player1.play(this.martianPropagation);
            // John Smyth was warded; ward removed, John still in play
            expect(this.johnSmyth.location).toBe('play area');
            expect(this.johnSmyth.tokens.ward || 0).toBe(0);
            expect(this.iyxrenuTheClever.location).toBe('discard');
            // Only 1 friendly destroyed → drew 2
            expect(this.player1.player.hand.length).toBe(handSize - 1 + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
