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

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'mars',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'envyx-glider']
                },
                player2: {
                    amber: 6,
                    inPlay: ['hunting-witch'],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'mars';
            this.tachyonManifold.printedHouse = 'mars';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.fightWith(this.envyxGlider, this.huntingWitch);
            this.player1.endTurn();
            this.player1.clickPrompt('mars');
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            expect(this.player2.player.getCurrentKeyCost()).toBe(7);
            expect(this.player2.player.getForgedKeys()).toBe(0);
            this.player2.clickPrompt('untamed');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
