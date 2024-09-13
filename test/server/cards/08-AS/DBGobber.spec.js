describe('D.B. Gobber', function () {
    describe("D.B. Gobber's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 7,
                    hand: ['db-gobber']
                },
                player2: {
                    amber: 9
                }
            });
        });

        it('makes opponent lose one on reap', function () {
            this.player1.playCreature(this.dbGobber);
            this.dbGobber.exhausted = false;
            this.player1.reap(this.dbGobber);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(8);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('makes each player with >= 7 amber lose 2', function () {
            this.player1.scrap(this.dbGobber);
            expect(this.dbGobber.location).toBe('discard');
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(7);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('only affects players with >= 7 amber', function () {
            this.player1.amber = 6;
            this.player1.scrap(this.dbGobber);
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(7);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
