describe('Deep Probe', function () {
    describe("Deep Probe's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['deep-probe', 'umbra']
                },
                player2: {
                    hand: ['krump', 'urchin', 'dodger', 'cannon']
                }
            });
        });

        it('should allow player to choose a house and reveal/discard all cards of that house', function () {
            this.player1.play(this.deepProbe);
            this.player1.clickPrompt('shadows');
            expect(this.umbra.location).toBe('hand');
            expect(this.krump.location).toBe('hand');
            expect(this.cannon.location).toBe('hand');
            expect(this.urchin.location).toBe('discard');
            expect(this.dodger.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
