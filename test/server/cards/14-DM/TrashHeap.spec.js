describe('Trash Heap', function () {
    describe("Trash Heap's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['trash-heap', 'troll', 'lamindra'],
                    inPlay: ['echofly']
                },
                player2: {
                    hand: ['bumpsy', 'paranormal-palisade'],
                    inPlay: ['krump']
                }
            });
        });

        it('destroys all creatures, discards creatures from hands, refills hands', function () {
            this.player1.play(this.trashHeap);
            expect(this.echofly.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            // Paranormal Palisade is creature too
            expect(this.paranormalPalisade.location).toBe('discard');
            // Hands refill to 6
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
