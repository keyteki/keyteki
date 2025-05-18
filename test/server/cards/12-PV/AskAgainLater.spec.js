describe('Ask Again Later', function () {
    describe("Ask Again Later's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'ask-again-later',
                        'expect-the-unexpected',
                        'bad-omen',
                        'heads-i-win'
                    ],
                    hand: ['ember-imp', 'parasitic-arachnoid'],
                    discard: ['ancient-bear', 'ember-imp', 'krump']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll', 'urchin']
                }
            });
        });

        it('should fulfill when revealed card does not match named house', function () {
            this.player1.activateProphecy(this.askAgainLater, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player1.moveCard(this.ancientBear, 'deck');
            this.player2.clickPrompt('dis');
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.ancientBear.location).toBe('deck');
            expect(this.parasiticArachnoid.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not fulfill when revealed card matches named house', function () {
            this.player1.activateProphecy(this.askAgainLater, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player1.moveCard(this.ancientBear, 'deck');
            this.player2.clickPrompt('untamed');
            expect(this.ancientBear.location).toBe('deck');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should only allow choosing houses from identity', function () {
            this.player1.activateProphecy(this.askAgainLater, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).toHavePromptButton('brobnar');
            expect(this.player2).not.toHavePromptButton('logos');
            expect(this.player2).not.toHavePromptButton('shadows');
            expect(this.player2).not.toHavePromptButton('mars');
        });
    });
});
