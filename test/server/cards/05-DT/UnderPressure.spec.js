describe('Under Pressure', function () {
    describe("Under Pressure's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    inPlay: ['llack-gaboon', 'hookmaster'],
                    hand: ['under-pressure', 'anger']
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra']
                }
            });

            this.player1.playUpgrade(this.underPressure, this.hookmaster);
        });

        it('should not be readied at end of round', function () {
            this.player1.reap(this.hookmaster);
            this.player1.reap(this.llackGaboon);
            this.player1.endTurn();
            expect(this.hookmaster.exhausted).toBe(true);
            expect(this.llackGaboon.exhausted).toBe(false);
        });

        it('should not be readied by action cards, but should be able to select the exhausted creature', function () {
            this.player1.reap(this.hookmaster);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.play(this.anger);
            this.player1.clickCard(this.hookmaster);
            expect(this.hookmaster.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
