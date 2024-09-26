describe('Scalawag Finn', function () {
    describe("Scalawag Finn's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['scalawag-finn']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });

            this.scalawagFinn.tokens.damage = 5;
        });

        it('should heal 3 damage on fight', function () {
            this.player1.fightWith(this.scalawagFinn, this.lamindra);
            expect(this.scalawagFinn.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
