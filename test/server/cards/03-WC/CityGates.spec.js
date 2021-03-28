describe('City Gates', function () {
    describe("City Gates's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['brutodon-auxiliary', 'legatus-raptor'],
                    inPlay: ['city-gates']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should capture 1 amber', function () {
            this.player1.play(this.brutodonAuxiliary);
            this.player1.useAction(this.cityGates);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.brutodonAuxiliary);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.brutodonAuxiliary.tokens.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should capture 2 ambers', function () {
            this.player1.play(this.legatusRaptor);
            this.player1.useAction(this.cityGates);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.legatusRaptor);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.legatusRaptor.tokens.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not capture an amber when there are no creatures in play', function () {
            this.player1.useAction(this.cityGates);
            expect(this.player1).not.toHavePrompt('Choose a creature');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not capture an amber when the opponent has 0', function () {
            this.player2.amber = 0;
            this.player1.play(this.brutodonAuxiliary);
            this.player1.useAction(this.cityGates);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(0);
            expect(this.brutodonAuxiliary.hasToken('amber')).toBe(false);
        });
    });
});
