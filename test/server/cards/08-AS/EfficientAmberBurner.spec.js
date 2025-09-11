describe('Efficient Amber Burner', function () {
    describe("Efficient Amber Burner's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 7,
                    house: 'skyborn',
                    hand: ['efficient-æmber-burner'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['charette']
                }
            });

            this.charette.amber = 3;
        });

        it('should decrease key cost for amber on creature', function () {
            this.player1.playUpgrade(this.efficientÆmberBurner, this.charette);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(4);
            this.player1.clickPrompt('skyborn');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make creature exalt on reap', function () {
            this.player1.playUpgrade(this.efficientÆmberBurner, this.charette);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.reap(this.charette);
            expect(this.charette.amber).toBe(4);
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(5);
            this.player1.clickPrompt('skyborn');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
