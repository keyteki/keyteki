describe('Cap Reigns', function () {
    describe("Cap Reigns's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['cap-reigns'],
                    amber: 0
                },
                player2: {
                    inPlay: ['krump', 'shock-herder'],
                    amber: 3
                }
            });
        });

        it('should make enemy creatures pay 1 amber after reaping', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(1);
            this.player2.reap(this.shockHerder);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player2);
        });

        it('should not affect friendly creatures', function () {
            this.player1.reap(this.capReigns);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
