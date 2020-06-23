describe('Redlock', function () {
    describe("Redlock's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 2,
                    inPlay: ['redlock', 'troll'],
                    hand: ['faygin']
                },
                player2: {
                    amber: 0,
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });

        it('should NOT give an amber if you play a creature', function () {
            this.player1.play(this.faygin);
            this.player1.endTurn();
            expect(this.player1.player.amber).toBe(2);
        });

        it("should give amber if you don't play a creature", function () {
            this.player1.endTurn();
            expect(this.player1.player.amber).toBe(3);
        });
    });
});
