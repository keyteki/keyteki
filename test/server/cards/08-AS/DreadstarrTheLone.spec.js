describe('Dreadstarr the Lone', function () {
    describe("Dreadstarr the Lone's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['rowdy-skald'],
                    inPlay: ['dreadstarr-the-lone', 'dust-pixie']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra', 'troll']
                }
            });
        });

        it('should cause opponent to lose one on fight', function () {
            this.player1.fightWith(this.dreadstarrTheLone, this.lamindra);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should have versatile if no other friendly Brobnar creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.reap(this.dreadstarrTheLone);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not have versatile if other friendly Brobnar creatures', function () {
            this.player1.playCreature(this.rowdySkald);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.clickCard(this.dreadstarrTheLone);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
