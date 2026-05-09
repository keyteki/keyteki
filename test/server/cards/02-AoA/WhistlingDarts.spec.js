describe('Whistling Darts', function () {
    describe("Whistling Darts' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['whistling-darts'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['krump', 'bumpsy', 'lamindra']
                }
            });
        });

        it('deals 1 damage to each enemy creature', function () {
            this.player1.play(this.whistlingDarts);
            expect(this.troll.damage).toBe(0);
            expect(this.krump.damage).toBe(1);
            expect(this.bumpsy.damage).toBe(1);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
