describe('Humble', function () {
    describe("Humble's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['consul-primus'],
                    hand: ['humble']
                },
                player2: {
                    amber: 4,
                    inPlay: ['senator-shrix']
                }
            });
        });

        it('should not move any amber if creature is already exhausted', function () {
            this.consulPrimus.exhausted = true;
            this.consulPrimus.tokens.amber = 10;
            this.player1.play(this.humble);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.consulPrimus);
            this.player1.clickCard(this.consulPrimus);

            expect(this.consulPrimus.amber).toBe(10);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should move amber if creature is exhausted', function () {
            this.senatorShrix.tokens.amber = 10;
            this.player1.play(this.humble);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.consulPrimus);
            this.player1.clickCard(this.senatorShrix);

            expect(this.senatorShrix.exhausted).toBe(true);
            expect(this.senatorShrix.amber).toBe(7);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should move enough amber if creature has less than 3', function () {
            this.senatorShrix.tokens.amber = 2;
            this.player1.play(this.humble);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.consulPrimus);
            this.player1.clickCard(this.senatorShrix);

            expect(this.senatorShrix.exhausted).toBe(true);
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('should just exhaust if creature has no amber', function () {
            this.player1.play(this.humble);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.consulPrimus);
            this.player1.clickCard(this.senatorShrix);

            expect(this.senatorShrix.exhausted).toBe(true);
            expect(this.senatorShrix.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });
});
