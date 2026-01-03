describe('Cowards End', function () {
    describe("Cowards End's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['coward-s-end'],
                    inPlay: ['dodger', 'silvertooth']
                },
                player2: {
                    inPlay: ['urchin', 'krump']
                }
            });
        });

        it('should destroy all creatures that are not damaged', function () {
            this.dodger.tokens.damage = 1;
            this.krump.tokens.damage = 1;
            this.player1.play(this.cowardSEnd);
            expect(this.dodger.location).toBe('play area');
            expect(this.silvertooth.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
            expect(this.urchin.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
