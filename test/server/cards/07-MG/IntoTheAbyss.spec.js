describe('Into the Abyss', function () {
    describe("Into the Abyss' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['into-the-abyss']
                },
                player2: {
                    hand: ['troll', 'lamindra', 'batdrone'],
                    deck: ['anger', 'foggify', 'krump', 'dodger', 'macis-asp']
                }
            });
        });

        it('opponent discards their hand and draws 4 cards', function () {
            expect(this.player2.hand.length).toBe(3);
            this.player1.play(this.intoTheAbyss);
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.batdrone.location).toBe('discard');
            expect(this.player2.hand.length).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
