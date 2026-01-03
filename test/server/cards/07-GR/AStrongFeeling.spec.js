describe('A Strong Feeling', function () {
    describe("A Strong Feeling's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['a-strong-feeling'],
                    inPlay: ['cpo-zytar', 'helmsman-spears', 'culf-the-quiet']
                },
                player2: {
                    inPlay: ['charette']
                }
            });
            this.cpoZytar.amber = 2;
            this.culfTheQuiet.amber = 5;
            this.charette.amber = 3;
            this.cpoZytar.exhausted = true;
            this.helmsmanSpears.exhausted = true;
            this.culfTheQuiet.exhausted = true;
        });

        it('readies each friendly creature with amber on it', function () {
            this.player1.play(this.aStrongFeeling);
            expect(this.cpoZytar.exhausted).toBe(false);
            expect(this.helmsmanSpears.exhausted).toBe(true);
            expect(this.culfTheQuiet.exhausted).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('removes 1 amber from each friendly creature', function () {
            this.player1.play(this.aStrongFeeling);
            expect(this.cpoZytar.amber).toBe(1);
            expect(this.helmsmanSpears.amber).toBe(0);
            expect(this.culfTheQuiet.amber).toBe(4);
            expect(this.charette.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
