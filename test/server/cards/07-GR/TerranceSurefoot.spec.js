describe('Terrance Surefoot', function () {
    describe("Terrance Surefoot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 7,
                    inPlay: ['terrance-surefoot'],
                    hand: ['db-gobber']
                },
                player2: {
                    inPlay: ['kelpminder'],
                    amber: 5
                }
            });
        });

        it('captures one on reap', function () {
            this.player1.reap(this.terranceSurefoot);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(4);
            expect(this.terranceSurefoot.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
        it('captures one on play', function () {
            this.player1.moveCard(this.terranceSurefoot, 'hand');
            this.player1.play(this.terranceSurefoot);
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(4);
            expect(this.terranceSurefoot.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
        it('moves one aember to the common supply on opponent reap', function () {
            this.terranceSurefoot.tokens.amber = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('Unfathomable');
            this.player2.reap(this.kelpminder);
            expect(this.player2.amber).toBe(6);
            expect(this.terranceSurefoot.amber).toBe(0);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
