describe('Opal Knight', function () {
    describe("Opal Knight's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['opal-knight'],
                    inPlay: ['troll', 'lamindra']
                },
                player2: {
                    inPlay: ['krump', 'bumpsy', 'urchin']
                }
            });
        });

        it('destroys each creature with even power on play', function () {
            this.player1.play(this.opalKnight);
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.krump.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.urchin.location).toBe('play area');
            expect(this.opalKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
