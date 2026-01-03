describe('We Can ALL Win', function () {
    describe("We Can ALL Win's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 5,
                    inPlay: ['lamindra'],
                    hand: ['we-can-all-win', 'spartasaur', 'saurus-rex']
                },
                player2: {
                    amber: 9,
                    inPlay: ['shooler']
                }
            });
        });

        it('both players should forge at -2A cost', function () {
            this.player1.play(this.weCanAllWin);
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            expect(this.player2.amber).toBe(5);
            this.player2.clickPrompt('Dis');
            this.player2.endTurn();
            this.player1.forgeKey('Red');
            expect(this.player1.amber).toBe(2);
            this.player1.clickPrompt('staralliance');
            this.player1.endTurn();
            this.player2.clickPrompt('Dis');
            this.expectReadyToTakeAction(this.player2);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'staralliance',
                    hand: ['we-can-all-win'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 4,
                    inPlay: ['dust-pixie'],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'staralliance';
            this.tachyonManifold.printedHouse = 'staralliance';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should not affect opponent's next turn", function () {
            this.player1.play(this.weCanAllWin);
            this.player1.endTurn();
            this.player1.clickPrompt('staralliance');
            expect(this.player1.player.getCurrentKeyCost()).toBe(4);
            expect(this.player2.player.getCurrentKeyCost()).toBe(4);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            expect(this.player2.player.getForgedKeys()).toBe(0);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
