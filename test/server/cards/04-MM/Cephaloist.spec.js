describe('Cephaloist', function () {
    describe("Cephaloist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 3,
                    inPlay: ['cephaloist']
                },
                player2: {
                    hand: ['phase-shift', 'bumpsy', 'dextre', 'urchin']
                }
            });
        });

        it('should not prevent amber being stolen when player has less than 4A', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.urchin);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
        });

        it('should prevent amber being stolen when player has 4A', function () {
            this.player1.player.amber = 4;
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.urchin);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(0);
        });

        it('should prevent amber being stolen when player has more than 4A', function () {
            this.player1.player.amber = 6;
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.urchin);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(0);
        });
    });
});
