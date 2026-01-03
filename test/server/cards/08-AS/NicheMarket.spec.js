describe('Niche Market', function () {
    describe("Niche Market's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'ekwidon',
                    inPlay: ['niche-market', 'the-old-tinker', 'iron-heidy']
                },
                player2: {
                    amber: 2,
                    inPlay: ['pelf', 'troll']
                }
            });
        });

        it('should give lowest powered creatures a steal action', function () {
            this.player1.useAction(this.theOldTinker);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            this.player1.clickCard(this.ironHeidy);
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            expect(this.player1).toHavePromptButton('Reap with this creature');
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.useAction(this.pelf);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            this.player2.clickCard(this.troll);
            expect(this.player2).not.toHavePromptButton("Use this card's Action ability");
            expect(this.player2).toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player2);
        });

        it('should transfer to next-lowest creature', function () {
            this.player1.fightWith(this.theOldTinker, this.pelf);
            this.player1.useAction(this.ironHeidy);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
