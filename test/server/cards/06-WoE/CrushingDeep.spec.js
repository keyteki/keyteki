describe('Crushing Deep', function () {
    describe("Crushing Deep's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['crushing-deep'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 30,
                    hand: ['key-charge', 'chota-hazri'],
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should increase key cost by 3 for each key opponent has forged', function () {
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.play(this.crushingDeep);
            expect(this.player1.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            this.player2.clickPrompt('untamed');
            expect(this.player2.amber).toBe(24);
            expect(this.player1.player.getCurrentKeyCost()).toBe(9);
            expect(this.player2.player.getCurrentKeyCost()).toBe(9);
            this.player2.play(this.chotaHazri);
            this.player2.clickPrompt('Yes');
            this.player2.clickPrompt('blue');
            expect(this.player2.amber).toBe(14);
            expect(this.player1.player.getCurrentKeyCost()).toBe(12);
            expect(this.player2.player.getCurrentKeyCost()).toBe(12);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'unfathomable',
                    hand: ['crushing-deep'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 12,
                    inPlay: [],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'unfathomable';
            this.tachyonManifold.printedHouse = 'unfathomable';
        });

        it("should affect opponent's next turn", function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.useAction(this.tachyonManifold);
            this.player1.play(this.crushingDeep);
            this.player1.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            expect(this.player2.player.getCurrentKeyCost()).toBe(9);
            expect(this.player2.player.getForgedKeys()).toBe(1);
            this.player2.clickPrompt('untamed');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
