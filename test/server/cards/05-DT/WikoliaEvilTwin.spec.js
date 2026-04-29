describe('Wikolia Evil Twin', function () {
    describe("Wikolia Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    inPlay: ['wikolia-evil-twin']
                },
                player2: {
                    amber: 9,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('exalt and raise keycost for opponent', function () {
            this.player1.reap(this.wikoliaEvilTwin);
            this.player1.endTurn();
            expect(this.wikoliaEvilTwin.amber).toBe(1);
            expect(this.player2).not.toHavePrompt('Forge a Key');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(9);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'unfathomable',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'wikolia-evil-twin']
                },
                player2: {
                    amber: 6,
                    inPlay: [],
                    hand: []
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'unfathomable');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.reap(this.wikoliaEvilTwin);
            this.player1.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player2.player.getCurrentKeyCost()).toBe(10);
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
