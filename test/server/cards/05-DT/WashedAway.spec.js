describe('Washed Away', function () {
    describe("Washed Away' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['washed-away'],
                    inPlay: ['flaxia', 'lifeward']
                },
                player2: {
                    amber: 4,
                    inPlay: ['gub', 'krump', 'cannon']
                }
            });
        });

        it('it should raise the tide when it is neutral', function () {
            this.player1.play(this.washedAway);
            expect(this.player1.isTideHigh()).toBe(true);
            expect(this.cannon.location).toBe('play area');
            expect(this.lifeward.location).toBe('play area');
        });

        it('it should raise the tide when it is low', function () {
            this.player1.lowerTide();
            expect(this.player1.isTideHigh()).toBe(false);
            this.player1.play(this.washedAway);
            expect(this.player1.isTideHigh()).toBe(true);
            expect(this.cannon.location).toBe('play area');
            expect(this.lifeward.location).toBe('play area');
        });

        it('it destroy all artifacts when tide is high', function () {
            this.player1.raiseTide();
            expect(this.player1.isTideHigh()).toBe(true);
            this.player1.play(this.washedAway);
            expect(this.cannon.location).toBe('discard');
            expect(this.lifeward.location).toBe('discard');
        });
    });
});
