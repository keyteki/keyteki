describe('John Smyth', function () {
    describe("John Smyth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['john-smyth', 'zorg', 'agent-hoo-man']
                },
                player2: {
                    inPlay: ['urchin']
                }
            });
        });

        it('should ready a non-Agent Mars creature on reap', function () {
            this.player1.reap(this.zorg);
            expect(this.zorg.exhausted).toBe(true);
            this.player1.reap(this.johnSmyth);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.agentHooMan);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.exhausted).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should ready a non-Agent Mars creature on fight', function () {
            this.player1.reap(this.zorg);
            expect(this.zorg.exhausted).toBe(true);
            this.player1.fightWith(this.johnSmyth, this.urchin);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.agentHooMan);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.exhausted).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
