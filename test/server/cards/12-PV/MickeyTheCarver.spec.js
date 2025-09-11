describe('Mickey the Carver', function () {
    describe("Mickey the Carver's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['mickey-the-carver'],
                    hand: ['searine'],
                    amber: 1
                },
                player2: {
                    amber: 3,
                    hand: ['faygin', 'ember-imp']
                }
            });
        });

        it('should steal an amber when opponent chooses a non-Shadows house', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });

        it('should not steal amber when opponent chooses Shadows house', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should steal amber when controller chooses a non-Shadows house', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });
    });
});
