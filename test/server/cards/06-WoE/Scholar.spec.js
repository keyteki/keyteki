describe('Scholar', function () {
    describe("Scholar's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'scholar',
                    amber: 1,
                    inPlay: ['scholar:the-shadow-council'],
                    hand: ['helper-bot', 'borrow', 'senator-shrix']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it("should not get versus card's effect", function () {
            expect(this.scholar.getKeywordValue('elusive')).toBe(0);
            this.player1.clickCard(this.scholar);
            expect(this.player1).toHavePromptButton('Reap with this creature');
            expect(this.player1).toHavePromptButton('Fight with this creature');
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
        });

        it('should draw a card after reap', function () {
            expect(this.player1.hand.length).toBe(3);
            this.player1.reap(this.scholar);
            expect(this.player1.amber).toBe(2);
            expect(this.player1.hand.length).toBe(4);
            this.player1.endTurn();
        });
    });
});
