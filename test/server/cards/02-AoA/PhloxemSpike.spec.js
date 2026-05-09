describe('Phloxem Spike', function () {
    describe("Phloxem Spike's play ability with no friendly creatures", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['phloxem-spike']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('destroys each non-flank creature when no friendly creatures are in play', function () {
            this.player1.play(this.phloxemSpike);
            expect(this.troll.location).toBe('play area');
            expect(this.krump.location).toBe('discard');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Phloxem Spike with friendly creatures in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['phloxem-spike'],
                    inPlay: ['lamindra']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('does nothing when there is at least one friendly creature in play', function () {
            this.player1.play(this.phloxemSpike);
            expect(this.troll.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.lamindra.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
