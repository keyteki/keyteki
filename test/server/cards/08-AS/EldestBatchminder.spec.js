describe('Eldest Batchminder', function () {
    describe("Eldest Batchminder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    inPlay: ['blypyp', 'troll', 'eldest-batchminder']
                },
                player2: {
                    inPlay: ['mindwarper']
                }
            });
        });

        it('should give 2 power counters to each other mars creature at the end of the turn', function () {
            this.player1.endTurn();
            expect(this.blypyp.getPower()).toBe(4);
            expect(this.troll.getPower()).toBe(8);
            expect(this.eldestBatchminder.getPower()).toBe(3);
            expect(this.mindwarper.getPower()).toBe(4);
            this.player2.clickPrompt('mars');
        });
    });
});
