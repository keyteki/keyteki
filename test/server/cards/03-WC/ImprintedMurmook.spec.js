describe('Imprinted Murmook', function () {
    describe("Imprinted Murmook's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'untamed',
                    inPlay: ['imprinted-murmook']
                },
                player2: {
                    amber: 5,
                    inPlay: ['bad-penny']
                }
            });
        });

        it('should reduce the controllers key cost by 1, but not the opponents', function () {
            this.player1.endTurn();
            expect(this.player2.amber).toBe(5);
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(0);
        });
    });
});
