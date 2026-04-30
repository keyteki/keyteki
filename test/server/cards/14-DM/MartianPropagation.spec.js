describe('Martian Propagation', function () {
    describe("Martian Propagation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['martian-propagation'],
                    inPlay: ['john-smyth', 'urchin', 'autocannon']
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
            expect(this.urchin.location).toBe('discard');
            expect(this.autocannon.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.player1.player.hand.length).toBe(handSize - 1 + 4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not draw for warded friendly creatures', function () {
            this.johnSmyth.tokens.ward = 1;
            const handSize = this.player1.player.hand.length;
            this.player1.play(this.martianPropagation);
            expect(this.johnSmyth.location).toBe('play area');
            expect(this.johnSmyth.warded).toBe(false);
            expect(this.urchin.location).toBe('discard');
            expect(this.autocannon.location).toBe('play area');
            expect(this.player1.player.hand.length).toBe(handSize - 1 + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
