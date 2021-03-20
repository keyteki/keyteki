describe('All Tide Up', function () {
    describe('all tide up is played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['bad-penny', 'tantadlin', 'fidgit', 'macis-asp', 'all-tide-up']
                },
                player2: {
                    inPlay: ['snufflegator', 'silvertooth']
                }
            });
        });

        it('it should raise the tide when it is neutral', function () {
            this.player1.play(this.allTideUp);
            expect(this.player1.isTideHigh()).toBe(true);
            expect(this.player1.amber).toBe(1);
        });

        it('it should raise the tide when it is low', function () {
            this.player1.lowerTide();
            expect(this.player1.isTideHigh()).toBe(false);
            this.player1.play(this.allTideUp);
            expect(this.player1.isTideHigh()).toBe(true);
            expect(this.player1.amber).toBe(1);
        });

        it('it should give aember the tide is high', function () {
            this.player1.raiseTide();
            this.player1.play(this.allTideUp);
            expect(this.player1.isTideHigh()).toBe(true);
            expect(this.player1.amber).toBe(2);
        });
    });
});
