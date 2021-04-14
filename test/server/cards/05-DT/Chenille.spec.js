describe('Chenille', function () {
    describe("Chenille's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['dust-pixie', 'bombyx'],
                    inPlay: ['chenille']
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
            this.player1.useAction(this.chenille);
            this.player1.endTurn();
            expect(this.dustPixie.location).toBe('discard');
        });

        it('should pick up bombyx from discard pile', function () {
            this.player1.moveCard(this.bombyx, 'discard');
            expect(this.bombyx.location).toBe('discard');
            this.player1.useAction(this.chenille);
            this.player1.clickCard(this.bombyx);
            this.player1.endTurn();
            expect(this.bombyx.location).toBe('hand');
        });
    });
});
