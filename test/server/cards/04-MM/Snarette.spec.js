describe('snarette', function () {
    describe("Snarette's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['snarette']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should capture an amber at end of turn', function () {
            expect(this.player2.amber).toBe(3);
            this.player1.endTurn();
            expect(this.player2.amber).toBe(2);
            expect(this.snarette.amber).toBe(1);
        });

        it('should remove all amber from Snarette when the action is used', function () {
            this.player1.endTurn();
            expect(this.snarette.amber).toBe(1);

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            expect(this.snarette.amber).toBe(2);

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            expect(this.snarette.amber).toBe(3);

            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.clickCard(this.snarette);
            expect(this.player1).toHavePrompt('Snarette');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.snarette.amber).toBe(0);
        });
    });
});
