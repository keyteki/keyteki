describe('Round Table', function () {
    describe("Round Table's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['round-table', 'raiding-knight', 'bulwark']
                },
                player2: {}
            });
        });

        it('should give Knight creatures +1 power and taunt', function () {
            expect(this.raidingKnight.power).toBe(3);
            expect(this.raidingKnight.getKeywordValue('taunt')).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not affect non-Knight creatures', function () {
            expect(this.bulwark.power).toBe(3);
            expect(this.bulwark.getKeywordValue('taunt')).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
