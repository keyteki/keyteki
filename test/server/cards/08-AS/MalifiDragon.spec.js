describe('Malifi Dragon', function () {
    describe("Malifi Dragon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['malifi-dragon']
                },
                player2: {
                    amber: 3,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should give 2 amber at the end of turn if < 4 amber', function () {
            this.player1.endTurn();
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            this.player2.clickPrompt('shadows');
        });

        it('should give 2 amber at the end of turn if exactly 4 amber', function () {
            this.player1.amber = 4;
            this.player1.endTurn();
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(3);
            this.player2.clickPrompt('shadows');
        });

        it('should not give 2 amber at the end of turn > 4 amber', function () {
            this.player1.amber = 5;
            this.player1.endTurn();
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(3);
            this.player2.clickPrompt('shadows');
        });

        it('should not give 2 amber at end of their opponents turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
        });
    });
});
