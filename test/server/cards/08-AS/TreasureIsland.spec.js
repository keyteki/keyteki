describe('Treasure Island', function () {
    describe("Treasure Island's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'skyborn',
                    inPlay: ['treasure-island', 'bosun-creen', 'charette']
                },
                player2: {
                    inPlay: ['ley-earl-of-hurl']
                }
            });

            this.bosunCreen.amber = 2;
            this.charette.amber = 3;
            this.leyEarlOfHurl.amber = 2;
        });

        it('should do nothing with no amber on Skyborn creature', function () {
            this.bosunCreen.amber = 0;
            this.player1.reap(this.bosunCreen);
            expect(this.treasureIsland.amber).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow spending amber on it for keys', function () {
            this.player1.reap(this.bosunCreen);
            expect(this.bosunCreen.amber).toBe(1);
            this.player1.amber = 5;
            this.player1.endTurn();
            this.player2.clickPrompt('skyborn');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.amber).toBe(0);
            expect(this.treasureIsland.amber).toBe(0);
        });
    });
});
