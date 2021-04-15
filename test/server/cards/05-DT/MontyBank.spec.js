describe('Monty Bank', function () {
    describe("Monty Bank's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['flaxia', 'monty-bank']
                },
                player2: {
                    amber: 5,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.moveCard(this.montyBank, 'hand');
                this.player1.play(this.montyBank);
            });

            it('should opt not to exalt', function () {
                this.player1.clickPrompt('Done');
                expect(this.montyBank.amber).toBe(0);
                this.player1.endTurn();
            });

            it('should opt to exalt once', function () {
                this.player1.clickPrompt('Exalt once');
                expect(this.montyBank.amber).toBe(1);
                this.player1.endTurn();
            });

            it('should opt to exalt twice', function () {
                this.player1.clickPrompt('Exalt twice');
                expect(this.montyBank.amber).toBe(2);
                this.player1.endTurn();
            });
        });

        describe('when action is used', function () {
            it('should not steal if no amber on it', function () {
                this.player1.useAction(this.montyBank);
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(5);
                this.player1.endTurn();
            });

            it('should steal 1A for each amber on it', function () {
                this.montyBank.amber = 2;
                this.player1.useAction(this.montyBank);
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(3);
                this.player1.endTurn();
            });
        });
    });
});
