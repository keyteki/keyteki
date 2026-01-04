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
                    amber: 1,
                    inPlay: ['ley-earl-of-hurl']
                }
            });

            this.bosunCreen.amber = 2;
        });

        it('should move amber to pool when Skyborn creature reaps', function () {
            this.player1.reap(this.bosunCreen);
            expect(this.treasureIsland.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.bosunCreen.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing when non-Skyborn creature reaps', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('skyborn');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.reap(this.charette);
            expect(this.treasureIsland.amber).toBe(0);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing when enemy Skyborn creature reaps', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('skyborn');
            this.player2.reap(this.leyEarlOfHurl);
            expect(this.treasureIsland.amber).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should allow spending amber on it for keys', function () {
            this.player1.reap(this.bosunCreen);
            expect(this.treasureIsland.amber).toBe(1);
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
