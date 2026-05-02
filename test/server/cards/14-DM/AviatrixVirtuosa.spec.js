describe('Aviatrix Virtuosa', function () {
    describe("Aviatrix Virtuosa's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['aviatrix-virtuosa'],
                    inPlay: ['bosun-creen', 'flip-stallard']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('exhausts each non-flank creature when played', function () {
            // Place Aviatrix on the right flank.
            this.player1.play(this.aviatrixVirtuosa);
            // Player1 battleline: bosun-creen (left), flip-stallard (center), aviatrix (right)
            expect(this.flipStallard.exhausted).toBe(true);
            // Player2 battleline: troll (left), krump (center), bumpsy (right)
            expect(this.troll.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(true);
            expect(this.bumpsy.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
