describe('Odoac The Patrician', function () {
    describe("Odoac The Patrician's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['phase-shift', 'bumpsy', 'dextre', 'urchin']
                },
                player2: {
                    amber: 4,
                    hand: ['odoac-the-patrician']
                }
            });
        });

        it('should not prevent amber being stolen when it has no amber on it', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.play(this.odoacThePatrician);
            expect(this.player2.amber).toBe(4);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.play(this.urchin);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });
    });

    describe("Odoac The Patrician's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['phase-shift', 'bumpsy', 'dextre', 'urchin']
                },
                player2: {
                    amber: 4,
                    hand: ['odoac-the-patrician']
                }
            });
        });

        it('should prevent amber being stolen when it has amber on it', function () {
            this.player1.player.amber = 1;
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.play(this.odoacThePatrician);
            expect(this.player2.amber).toBe(4);
            expect(this.player1.amber).toBe(0);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.play(this.urchin);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
        });
    });
});
