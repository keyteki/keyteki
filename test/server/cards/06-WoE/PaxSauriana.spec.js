describe('PaxSauriana', function () {
    describe('on play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    hand: ['bubbles', 'pax-sauriana'],
                    inPlay: ['flaxia', 'chelonia', 'senator-shrix']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });

            this.player1.play(this.paxSauriana);
        });

        it('should ward each creature', function () {
            expect(this.flaxia.warded).toBe(true);
            expect(this.chelonia.warded).toBe(true);
            expect(this.senatorShrix.warded).toBe(true);
            expect(this.gub.warded).toBe(true);
            expect(this.krump.warded).toBe(true);
        });
    });
});
