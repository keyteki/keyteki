describe('Monty Bank Evil Twin', function () {
    describe("Monty Bank Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['flaxia', 'monty-bank-evil-twin']
                },
                player2: {
                    amber: 5,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.moveCard(this.montyBankEvilTwin, 'hand');
                this.player1.play(this.montyBankEvilTwin);
            });

            it('should exalt twice', function () {
                expect(this.montyBankEvilTwin.amber).toBe(2);
                this.player1.endTurn();
            });
        });

        describe('when action is used', function () {
            it('should not steal if no amber on it', function () {
                this.player1.useAction(this.montyBankEvilTwin);
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(5);
                this.player1.endTurn();
            });

            it('should steal 1A for each amber on it', function () {
                this.montyBankEvilTwin.amber = 2;
                this.player1.useAction(this.montyBankEvilTwin);
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(3);
                this.player1.endTurn();
            });
        });
    });
});
