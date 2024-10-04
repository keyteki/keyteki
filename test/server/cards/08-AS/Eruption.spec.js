describe('Eruption', function () {
    describe("Eruption's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['eruption']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should exalt 3 times on play', function () {
            this.player1.playCreature(this.eruption);
            expect(this.eruption.amber).toBe(3);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should move one amber to your pool on fight', function () {
            this.player1.playCreature(this.eruption);
            this.eruption.exhausted = false;
            this.player1.fightWith(this.eruption, this.lamindra);
            expect(this.eruption.amber).toBe(2);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });
    });
});
