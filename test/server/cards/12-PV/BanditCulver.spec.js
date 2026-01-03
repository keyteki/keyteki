describe('Bandit Culver', function () {
    describe("Bandit Culver's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['bandit-culver'],
                    hand: ['urchin', 'umbra', 'duskwitch', 'ransack'],
                    discard: ['mooncurser'],
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
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not steal 1 amber when discarding from deck', function () {
            this.player1.moveCard(this.duskwitch, 'deck');
            this.player1.moveCard(this.mooncurser, 'deck');
            this.player1.play(this.ransack);
            expect(this.player1.amber).toBe(3); // only steal 2 from ransack
            expect(this.player2.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not steal amber when discarding second Shadows card', function () {
            this.player1.scrap(this.urchin);
            this.player1.scrap(this.umbra);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not steal amber when discarding non-Shadows card', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.scrap(this.duskwitch);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not steal amber when opponent discards Shadows card', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.scrap(this.nerveBlast);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player2);
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
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
