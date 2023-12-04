describe('Dextre', function () {
    describe("Dextre's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dextre']
                },
                player2: {
                    amber: 1,
                    hand: ['punch']
                }
            });
            this.player1.play(this.dextre);
        });

        it('should capture an amber when it comes into play', function () {
            expect(this.dextre.location).toBe('play area');
            expect(this.dextre.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });

        it('should move to the top of the deck when it is destroyed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.punch);
            this.player2.clickCard(this.dextre);
            expect(this.player1.player.deck[0]).toBe(this.dextre);
            expect(this.player2.amber).toBe(2);
        });
    });
});
