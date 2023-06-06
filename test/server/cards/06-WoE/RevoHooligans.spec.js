describe('Revo Hooligans', function () {
    describe("Revo Hooligans's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['revo-hooligans', 'shard-of-knowledge', 'envoy-of-ekwirrĕ', 'animator']
                },
                player2: {
                    hand: ['sneklifter'],
                    inPlay: ['gauntlet-of-command', 'bumpsy']
                }
            });

            this.animator.printedHouse = 'ekwidon';
            this.animator.maverick = 'ekwidon';
        });

        it('should add a paint counter to a friendly artifact', function () {
            this.player1.reap(this.revoHooligans);
            this.player1.clickCard(this.shardOfKnowledge);
            expect(this.shardOfKnowledge.tokens.paint).toBe(1);
            let handSize = this.player1.hand.length;
            this.player1.useAction(this.shardOfKnowledge);
            expect(this.player1.hand.length).toBe(handSize + 1);
        });

        it('should add a paint counter to an enemy artifact', function () {
            this.player1.reap(this.revoHooligans);
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.gauntletOfCommand.tokens.paint).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickCard(this.gauntletOfCommand);
            expect(this.player2).not.toHavePromptButton("Use this card's Action ability");
        });

        it('have its ability overriden by other change house effects', function () {
            this.player1.reap(this.revoHooligans);
            this.player1.clickCard(this.shardOfKnowledge);
            expect(this.shardOfKnowledge.tokens.paint).toBe(1);
            let handSize = this.player1.hand.length;
            this.player1.useAction(this.shardOfKnowledge);
            expect(this.player1.hand.length).toBe(handSize + 1);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.sneklifter, true);
            this.player2.clickCard(this.shardOfKnowledge);
            handSize = this.player2.hand.length;
            this.player2.useAction(this.shardOfKnowledge);
            expect(this.player2.hand.length).toBe(handSize + 1);
        });

        it('should lose ability when the paint counter is removed', function () {
            this.player1.reap(this.revoHooligans);
            this.player1.clickCard(this.shardOfKnowledge);
            expect(this.shardOfKnowledge.tokens.paint).toBe(1);
            let handSize = this.player1.hand.length;
            this.player1.useAction(this.shardOfKnowledge);
            expect(this.player1.hand.length).toBe(handSize + 1);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.useAction(this.animator);
            this.player1.clickCard(this.shardOfKnowledge);
            this.player1.clickPrompt('Right');
            this.player1.reap(this.envoyOfEkwirrĕ);
            this.player1.clickCard(this.shardOfKnowledge);
            expect(this.envoyOfEkwirrĕ.tokens.paint).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.clickCard(this.shardOfKnowledge);
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
        });

        it('should grant the effect even after it dies', function () {
            this.player1.reap(this.revoHooligans);
            this.player1.clickCard(this.shardOfKnowledge);
            expect(this.shardOfKnowledge.tokens.paint).toBe(1);
            let handSize = this.player1.hand.length;
            this.player1.useAction(this.shardOfKnowledge);
            expect(this.player1.hand.length).toBe(handSize + 1);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.fightWith(this.revoHooligans, this.bumpsy);
            expect(this.revoHooligans.location).toBe('discard');
            handSize = this.player1.hand.length;
            this.player1.useAction(this.shardOfKnowledge);
            expect(this.player1.hand.length).toBe(handSize + 1);
        });
    });
});
