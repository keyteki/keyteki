describe('Symposium', function () {
    describe("Symposium's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    token: 'grumpus',
                    inPlay: ['pelf', 'grumpus:press-gang'],
                    hand: ['symposium']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should exalt, ready, and use a friendly creature', function () {
            this.player1.play(this.symposium);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.grumpus);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.pelf.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should repeat if you use a token first', function () {
            this.player1.play(this.symposium);
            this.player1.clickCard(this.grumpus);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.grumpus.amber).toBe(1);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.pelf.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('optionally do nothing after using a token', function () {
            this.player1.play(this.symposium);
            this.player1.clickCard(this.grumpus);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.grumpus.amber).toBe(1);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
