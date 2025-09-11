describe('Blunderbore', function () {
    describe("Blunderbore's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['press-gang'],
                    inPlay: ['blunderbore'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 3,
                    inPlay: ['cpo-zytar']
                }
            });
        });

        it('causes opponent to lose 1 after fight if not haunted', function () {
            this.player1.fightWith(this.blunderbore, this.cpoZytar);
            expect(this.player2.amber).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('causes opponent to lose 2 after fight if not haunted', function () {
            this.player1.play(this.pressGang);
            this.player1.fightWith(this.blunderbore, this.cpoZytar);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
