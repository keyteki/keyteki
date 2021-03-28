describe('Mastermindy', function () {
    describe("Mastermindy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 3,
                    inPlay: ['flaxia', 'senator-shrix'],
                    hand: ['mastermindy']
                },
                player2: {
                    amber: 2,
                    inPlay: ['dextre', 'bull-wark', 'urchin']
                }
            });
        });

        it("should add a scheme counter at end of owner's turn", function () {
            this.player1.play(this.mastermindy);
            expect(this.mastermindy.tokens.scheme).toBeUndefined();
            this.player1.endTurn();
            expect(this.mastermindy.tokens.scheme).toBe(1);
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            expect(this.mastermindy.tokens.scheme).toBe(1);
            this.player1.clickPrompt('shadows');
            this.player1.endTurn();
            expect(this.mastermindy.tokens.scheme).toBe(2);
        });

        it('should remove scheme counters and steal as much amber', function () {
            this.player1.play(this.mastermindy);
            this.mastermindy.exhausted = false;
            this.mastermindy.tokens.scheme = 4;
            this.player1.useAction(this.mastermindy);
            expect(this.mastermindy.tokens.scheme).toBeUndefined();
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(0);
        });
    });
});
