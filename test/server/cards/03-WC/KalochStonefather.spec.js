describe('Kaloch Stonefather', function () {
    describe("Kaloch Stonefather's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['kaloch-stonefather'],
                    hand: ['groke', 'bingle-bangbang', 'brammo', 'cowfyne', 'foozle', 'groggins']
                },
                player2: {
                    inPlay: ['zorg']
                }
            });
        });
        it('grant himself skirmish when he is alone on the board [1]', function () {
            expect(this.kalochStonefather.getKeywordValue('skirmish')).toBe(1);
        });
        it("should not have skirmish because he's not in the middle of the battleline [2]", function () {
            this.player1.play(this.groke);
            expect(this.kalochStonefather.getKeywordValue('skirmish')).toBe(0);
            expect(this.groke.getKeywordValue('skirmish')).toBe(0);
        });
        it("give everyone skirmish because he's back in the middle of the battleline [3]", function () {
            this.player1.play(this.groke);
            this.player1.play(this.bingleBangbang, true);
            expect(this.kalochStonefather.getKeywordValue('skirmish')).toBe(1);
            expect(this.bingleBangbang.getKeywordValue('skirmish')).toBe(1);
            expect(this.groke.getKeywordValue('skirmish')).toBe(1);
        });
        it("should not have skirmish because he's not in the middle of the battleline [4]", function () {
            this.player1.play(this.groke);
            this.player1.play(this.bingleBangbang, true);
            this.player1.play(this.brammo);
            expect(this.kalochStonefather.getKeywordValue('skirmish')).toBe(0);
            expect(this.bingleBangbang.getKeywordValue('skirmish')).toBe(0);
            expect(this.groke.getKeywordValue('skirmish')).toBe(0);
            expect(this.brammo.getKeywordValue('skirmish')).toBe(0);
        });
        it("should have skirmish because he's in the middle of the battleline [5]", function () {
            this.player1.play(this.groke);
            this.player1.play(this.bingleBangbang, true);
            this.player1.play(this.brammo);
            this.player1.play(this.cowfyne, true);
            expect(this.kalochStonefather.getKeywordValue('skirmish')).toBe(1);
            expect(this.bingleBangbang.getKeywordValue('skirmish')).toBe(1);
            expect(this.groke.getKeywordValue('skirmish')).toBe(1);
            expect(this.brammo.getKeywordValue('skirmish')).toBe(1);
            expect(this.cowfyne.getKeywordValue('skirmish')).toBe(1);
        });
        it("should not have skirmish because he's not in the middle of the battleline [5]", function () {
            this.player1.play(this.groke);
            this.player1.play(this.bingleBangbang, true);
            this.player1.play(this.brammo);
            this.player1.play(this.cowfyne);
            expect(this.kalochStonefather.getKeywordValue('skirmish')).toBe(0);
            expect(this.bingleBangbang.getKeywordValue('skirmish')).toBe(0);
            expect(this.groke.getKeywordValue('skirmish')).toBe(0);
            expect(this.brammo.getKeywordValue('skirmish')).toBe(0);
            expect(this.cowfyne.getKeywordValue('skirmish')).toBe(0);
        });
    });
});
