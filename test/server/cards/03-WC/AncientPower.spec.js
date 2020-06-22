describe('Ancient Power', function () {
    describe("Ancient Power's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['troll', 'krump', 'flaxia', 'knoxx'],
                    hand: ['ancient-power']
                },
                player2: {
                    inPlay: ['lamindra', 'gub']
                }
            });
            this.troll.tokens.amber = 1;
            this.krump.tokens.amber = 10;
            this.flaxia.tokens.amber = 1;
            this.flaxia.ward();

            this.lamindra.tokens.amber = 1;
        });

        it('Play must ward all friendly creatures', function () {
            this.player1.play(this.ancientPower);

            expect(this.troll.warded).toBe(true);
            expect(this.krump.warded).toBe(true);
            expect(this.flaxia.warded).toBe(true);
            expect(this.knoxx.warded).toBe(false);
            expect(this.gub.warded).toBe(false);
            expect(this.lamindra.warded).toBe(false);
        });
    });
});
