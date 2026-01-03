describe('Earthshaker', function () {
    describe("Earthshaker's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['earthshaker']
                },
                player2: {
                    inPlay: ['urchin', 'umbra', 'krump', 'dodger']
                }
            });
        });

        it('should destroy each creature with power 3 or lower', function () {
            this.player1.play(this.earthshaker);
            expect(this.urchin.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
            expect(this.dodger.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
