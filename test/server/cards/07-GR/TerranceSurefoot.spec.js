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

        it('makes opponent lose one on reap', function () {
            this.player1.reap(this.terranceSurefoot);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(4);
            expect(this.terranceSurefoot.amber).toBe(1);
        });
        it('makes captured token move to common supply on reap', function () {
            this.terranceSurefoot.tokens.amber = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('Unfathomable');
            this.player2.reap(this.kelpminder);
            expect(this.player2.amber).toBe(6);
            expect(this.terranceSurefoot.amber).toBe(0);
        });
    });
});
