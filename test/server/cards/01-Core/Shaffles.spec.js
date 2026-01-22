describe('Shaffles', function () {
    describe("Shaffles's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['shaffles']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should make opponent lose 1 amber at end of turn', function () {
            this.player1.endTurn();
            expect(this.player2.amber).toBe(1);
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not trigger on opponent turn end', function () {
            this.player1.endTurn();
            expect(this.player2.amber).toBe(1);
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            expect(this.player2.amber).toBe(1);
            this.player1.clickPrompt('dis');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
