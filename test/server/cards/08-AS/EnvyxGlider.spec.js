describe('Envyx Glider', function () {
    describe("Envyx Glider's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['envyx-glider', 'blypyp', 'pelf']
                },
                player2: {
                    amber: 10,
                    inPlay: ['john-smyth', 'rowdy-skald'],
                    hand: ['hypnobeam']
                }
            });
        });

        it('should increase opponents key cost after a fight', function () {
            this.player1.fightWith(this.envyxGlider, this.rowdySkald);
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(2);
        });
    });
});
