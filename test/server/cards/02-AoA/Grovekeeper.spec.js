describe('Grovekeeper', function () {
    describe("Grovekeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['dust-pixie', 'grovekeeper', 'flaxia']
                },
                player2: {}
            });
        });

        it("should give each neighboring creature a +1 power counter at end of controller's turn", function () {
            this.player1.endTurn();
            expect(this.dustPixie.powerCounters).toBe(1);
            expect(this.flaxia.powerCounters).toBe(1);
            expect(this.grovekeeper.powerCounters).toBe(0);
            this.player2.clickPrompt('sanctum');
            this.player2.endTurn();
            expect(this.dustPixie.powerCounters).toBe(1);
            expect(this.flaxia.powerCounters).toBe(1);
            expect(this.grovekeeper.powerCounters).toBe(0);
            this.player1.clickPrompt('untamed');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
