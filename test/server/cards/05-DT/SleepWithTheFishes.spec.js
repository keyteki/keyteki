describe('Sleep with the Fishes', function () {
    describe("Sleep with the Fishes's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    inPlay: ['hookmaster', 'marshal-ewer'],
                    hand: ['sleep-with-the-fishes']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens', 'lamindra']
                }
            });
        });

        it('should destroy each exhausted creature', function () {
            this.hookmaster.exhaust();
            this.murkens.exhaust();
            this.player1.play(this.sleepWithTheFishes);
            expect(this.hookmaster.location).toBe('discard');
            expect(this.marshalEwer.location).toBe('play area');
            expect(this.murkens.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
        });
    });
});
