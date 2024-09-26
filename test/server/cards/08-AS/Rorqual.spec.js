describe('Rorqual', function () {
    describe("Rorqual's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['rorqual']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });

            this.rorqual.amber = 3;
        });

        it('should exalt on reap and get +1 power for each amber on it', function () {
            this.player1.reap(this.rorqual);
            expect(this.rorqual.amber).toBe(4);
            expect(this.rorqual.getPower()).toBe(9);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should exalt on fight', function () {
            this.player1.fightWith(this.rorqual, this.lamindra);
            expect(this.rorqual.amber).toBe(4);
            expect(this.rorqual.getPower()).toBe(9);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should move all amber to pool on action', function () {
            this.player1.useAction(this.rorqual);
            expect(this.rorqual.amber).toBe(0);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
