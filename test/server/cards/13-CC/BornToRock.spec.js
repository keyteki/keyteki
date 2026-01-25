describe('Born to Rock', function () {
    describe("Born to Rock's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['born-to-rock', 'shorty', 'culf-the-quiet', 'foozle', 'troll', 'gub']
                },
                player2: {
                    inPlay: ['flaxia', 'silvertooth', 'brammo', 'krump']
                }
            });
        });

        it('should give +1 power to each Brobnar creature for each Brobnar neighbor', function () {
            expect(this.shorty.power).toBe(4 + 1); // 1 Brobnar neighbor
            expect(this.culfTheQuiet.power).toBe(6 + 2); // 1 Brobnar neighbor
            expect(this.foozle.power).toBe(5 + 2); // 1 Brobnar neighbor
            expect(this.troll.power).toBe(8 + 1); // 1 brobnar neighbor
            expect(this.gub.power).toBe(1);
            expect(this.brammo.power).toBe(4);
        });

        it('should update power dynamically as neighbors change', function () {
            this.player1.moveCard(this.shorty, 'discard');
            expect(this.culfTheQuiet.power).toBe(6 + 1);
        });
    });
});
