describe('The Æmber Road', function () {
    describe("The Æmber Road's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'ekwidon',
                    inPlay: ['the-æmber-road']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('allows player to add trade counters', function () {
            this.player1.useOmni(this.theÆmberRoad);
            expect(this.theÆmberRoad.tokens.trade).toBe(1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.player.cardsInPlay).toContain(this.theÆmberRoad);
            expect(this.player1.player.cardsInPlay).not.toContain(this.theÆmberRoad);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.theÆmberRoad.exhausted).toBe(true);
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.useOmni(this.theÆmberRoad);
            expect(this.theÆmberRoad.tokens.trade).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.player.cardsInPlay).toContain(this.theÆmberRoad);
            expect(this.player2.player.cardsInPlay).not.toContain(this.theÆmberRoad);
        });
    });
});
