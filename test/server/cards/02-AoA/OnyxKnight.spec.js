describe('Onyx Knight', function () {
    describe("Onyx Knight's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['onyx-knight'],
                    inPlay: ['troll', 'lamindra']
                },
                player2: {
                    inPlay: ['krump', 'bumpsy', 'urchin']
                }
            });
        });

        it('destroys each creature with odd power on play', function () {
            this.player1.play(this.onyxKnight);
            expect(this.troll.location).toBe('play area');
            expect(this.lamindra.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.urchin.location).toBe('discard');
            expect(this.onyxKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
