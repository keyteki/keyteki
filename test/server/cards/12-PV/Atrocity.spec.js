describe('Atrocity', function () {
    describe("Atrocity's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['atrocity']
                },
                player2: {
                    amber: 4,
                    discard: ['ancient-bear', 'ember-imp', 'krump']
                }
            });
        });

        it('should discard top card and force house choice', function () {
            this.player2.moveCard(this.ancientBear, 'discard');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).not.toHavePromptButton('dis');
            expect(this.player2).not.toHavePromptButton('brobnar');
            this.player2.clickPrompt('untamed');
            expect(this.ancientBear.location).toBe('discard');
            expect(this.atrocity.tokens.damage).toBe(1);
        });

        it('should not trigger if opponent has no deck', function () {
            this.player2.player.deck = [];
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('brobnar');
            expect(this.atrocity.tokens.damage).toBe(1);
            this.player2.clickPrompt('untamed');
        });

        it('should trigger when Atrocity dies from the damage', function () {
            this.atrocity.tokens.damage = 2;
            this.player2.moveCard(this.ancientBear, 'discard');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).not.toHavePromptButton('dis');
            expect(this.player2).not.toHavePromptButton('brobnar');
            expect(this.atrocity.location).toBe('discard');
            this.player2.clickPrompt('untamed');
        });
    });
});
