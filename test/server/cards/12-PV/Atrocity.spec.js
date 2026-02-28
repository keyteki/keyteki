describe('Atrocity', function () {
    describe("Atrocity's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['atrocity']
                },
                player2: {
                    amber: 4,
                    discard: ['ancient-bear', 'ember-imp', 'krump']
                }
            });
        });

        it('should discard top card and force house choice on next turn', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player1.playCreature(this.atrocity);
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).not.toHavePromptButton('dis');
            expect(this.player2).not.toHavePromptButton('brobnar');
            this.player2.clickPrompt('untamed');
            expect(this.ancientBear.location).toBe('discard');
            expect(this.atrocity.damage).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not restrict house if opponent has no deck', function () {
            this.player2.player.deck = [];
            this.player1.playCreature(this.atrocity);
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('brobnar');
            expect(this.atrocity.damage).toBe(0);
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should only trigger once (on the next turn)', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player1.playCreature(this.atrocity);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.ancientBear.location).toBe('discard');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('brobnar');
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
