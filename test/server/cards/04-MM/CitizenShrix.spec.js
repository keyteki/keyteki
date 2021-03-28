describe('Citizen Shrix', function () {
    describe("Citizen Shrix's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'saurian',
                    hand: ['citizen-shrix']
                },
                player2: {
                    amber: 4,
                    hand: ['troll']
                }
            });
        });

        it('should exalt on play', function () {
            this.player1.play(this.citizenShrix);
            expect(this.citizenShrix.tokens.amber).toBe(1);
        });

        it('should steal on play', function () {
            expect(this.player2.amber).toBe(4);
            expect(this.player1.amber).toBe(0);
            this.player1.play(this.citizenShrix);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(1);
        });

        it('should exalt on reap', function () {
            this.player1.play(this.citizenShrix);
            expect(this.citizenShrix.tokens.amber).toBe(1);
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            this.player1.clickPrompt('saurian');
            this.player1.reap(this.citizenShrix);
            expect(this.citizenShrix.tokens.amber).toBe(2);
        });

        it('should steal on reap', function () {
            expect(this.player2.amber).toBe(4);
            expect(this.player1.amber).toBe(0);

            this.player1.play(this.citizenShrix);
            this.player1.endTurn();

            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();

            this.player1.clickPrompt('saurian');
            this.player1.reap(this.citizenShrix);

            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
        });
    });
});
