describe('Falcron', function () {
    describe("Falcron's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['krump', 'falcron', 'pelf', 'rowdy-skald']
                },
                player2: {
                    amber: 4
                }
            });
        });

        it('should give neighbors a reap steal ability', function () {
            this.player1.reap(this.krump);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            this.player1.reap(this.falcron);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
            this.player1.reap(this.pelf);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(2);
            this.player1.reap(this.rowdySkald);
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
