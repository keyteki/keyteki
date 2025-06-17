describe('Flarie', function () {
    describe("Flarie's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 2,
                    inPlay: ['flarie']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should gain 1 amber at the start of your turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
            this.player1.clickPrompt('untamed');
        });

        it('should not gain amber at the start of opponent turn', function () {
            this.player1.endTurn();
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            this.player2.clickPrompt('brobnar');
        });
    });
});
