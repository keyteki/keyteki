describe('The Shadow Council', function () {
    describe("The Shadow Council's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['the-shadow-council'],
                    hand: ['silvertooth', 'nexus']
                },
                player2: {
                    amber: 6,
                    inPlay: ['zorg']
                }
            });
        });
        it("have 'Action: Steal 2A' if in center [1]", function () {
            this.player1.clickCard(this.theShadowCouncil);
            expect(this.player1).toHavePrompt('The Shadow Council');
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
        });
        it("not have 'Action: Steal 2A' if not in center [2]", function () {
            this.player1.play(this.silvertooth);
            this.player1.clickCard(this.theShadowCouncil);
            expect(this.player1).toHavePrompt('The Shadow Council');
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(6);
        });
        it("have 'Action: Steal 2A' if in center [3]", function () {
            this.player1.play(this.silvertooth);
            this.player1.play(this.nexus, true);
            this.player1.clickCard(this.theShadowCouncil);
            expect(this.player1).toHavePrompt('The Shadow Council');
            expect(this.player1).toHavePromptButton("Use this card's Action ability");
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
        });
    });
});
