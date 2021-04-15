describe('Trial by Water', function () {
    describe("Trial by Water's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'sanctum',
                    inPlay: ['armsmaster-molina'],
                    hand: ['trial-by-water']
                },
                player2: {
                    amber: 3,
                    inPlay: ['murkens']
                }
            });
        });

        it('should be able to raise the tide before playing the action', function () {
            this.player1.raiseTide();
            expect(this.player1.isTideHigh()).toBe(true);
            this.player1.play(this.trialByWater);
            expect(this.player1.isTideNeutral()).toBe(true);
        });

        it('should not be able to raise the tide after playing the action', function () {
            this.player1.play(this.trialByWater);
            expect(this.player1).not.toBeAbleToRaiseTide();
        });

        it("should last until opponent's turn", function () {
            this.player1.play(this.trialByWater);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.player2).not.toBeAbleToRaiseTide();
        });

        it('should last until next turn', function () {
            this.player1.play(this.trialByWater);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            expect(this.player1).toBeAbleToRaiseTide();
            this.player1.raiseTide();
            expect(this.player1.isTideHigh()).toBe(true);
        });
    });
});
