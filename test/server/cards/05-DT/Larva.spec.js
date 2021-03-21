describe('Larva', function () {
    describe("Larva's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['dust-pixie', 'cocoon'],
                    inPlay: ['larva']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should do nothing when there is no cacoon in the discard', function () {
            this.player1.moveCard(this.dustPixie, 'discard');
            expect(this.dustPixie.location).toBe('discard');
            this.player1.useAction(this.larva);
            this.player1.endTurn();
            expect(this.dustPixie.location).toBe('discard');
        });

        it('should pick up cocoon from discard pile', function () {
            this.player1.moveCard(this.cocoon, 'discard');
            expect(this.cocoon.location).toBe('discard');
            this.player1.useAction(this.larva);
            this.player1.clickCard(this.cocoon);
            this.player1.endTurn();
            expect(this.cocoon.location).toBe('hand');
        });
    });
});
