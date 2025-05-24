describe('The Constant', function () {
    describe("The Constant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'brobnar',
                    hand: ['the-constant']
                },
                player2: {
                    amber: 5,
                    inPlay: ['dextre']
                }
            });
        });

        it('should get two time counters on play', function () {
            this.player1.play(this.theConstant);
            expect(this.theConstant.tokens.time).toBe(2);
        });

        it('should skip draw step', function () {
            this.player1.play(this.theConstant);
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(0);
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            expect(this.player2.player.hand.length).toBe(0);
            this.player1.clickPrompt('brobnar');
        });

        it('should remove a time counter at the start of the turn', function () {
            this.player1.play(this.theConstant);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.theConstant.tokens.time).toBe(1);
        });

        it('should destroy itself if there are no time counters', function () {
            this.player1.play(this.theConstant);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');
            expect(this.theConstant.location).toBe('discard');
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(0);
        });
    });
});
