describe('Bandit Culver', function () {
    describe("Bandit Culver's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['bandit-culver'],
                    hand: ['urchin', 'umbra', 'duskwitch'],
                    amber: 1
                },
                player2: {
                    amber: 3,
                    hand: ['nerve-blast']
                }
            });
        });

        it('should steal 1 amber when discarding first Shadows card', function () {
            this.player1.scrap(this.urchin);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not steal amber when discarding second Shadows card', function () {
            this.player1.scrap(this.urchin);
            this.player1.scrap(this.umbra);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not steal amber when discarding non-Shadows card', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.scrap(this.duskwitch);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not steal amber when opponent discards Shadows card', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.scrap(this.nerveBlast);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should reset counter at start of turn', function () {
            this.player1.scrap(this.urchin);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.scrap(this.umbra);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
