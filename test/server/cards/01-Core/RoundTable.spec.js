describe('Round Table', function () {
    describe("Round Table's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['round-table', 'raiding-knight', 'jehu-the-bureaucrat', 'the-terror']
                },
                player2: {}
            });
        });

        it('should give Knight creatures +1 power and taunt', function () {
            expect(this.raidingKnight.power).toBe(5);
            expect(this.raidingKnight.getKeywordValue('taunt')).toBe(1);
            expect(this.jehuTheBureaucrat.power).toBe(3);
            expect(this.jehuTheBureaucrat.getKeywordValue('taunt')).toBe(0);
            expect(this.theTerror.power).toBe(6);
            expect(this.theTerror.getKeywordValue('taunt')).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
